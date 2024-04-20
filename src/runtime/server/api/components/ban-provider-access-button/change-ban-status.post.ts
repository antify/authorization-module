import {createError, defineEventHandler, readBody} from '#imports';
import {isLoggedInHandler} from '../../../handlers';
import {PermissionId} from '../../../../glue/permissions';
import {type DatabaseHandler} from '../../../databaseHandler';
import defineDatabaseHandler from '#authorization-module-database-handler';
import {isMongoDbObjectIdRule, isOneOfRule, useValidator} from '@antify/validate';
import type {
	ChangeBanStatusRequestBody,
	ProviderAccess
} from '~/src/runtime/glue/components/ban-provider-access-button/types';
import {type ProviderAccess as ProviderAccessDoc} from '../../../datasources/providerAccess';

export const validator = useValidator<ChangeBanStatusRequestBody>({
	authorizationId: {
		rules: isMongoDbObjectIdRule
	},
	providerAccessId: {
		rules: isMongoDbObjectIdRule
	},
	action: {
		rules: (val) => isOneOfRule(val, ['ban', 'unban'])
	}
});

export default defineEventHandler<ProviderAccess>(async (event) => {
	const guard = await isLoggedInHandler(event);
	const body = validator.validate(await readBody(event));

	if (validator.hasErrors()) {
		throw new Error(validator.getErrorsAsString());
	}

	if (body.authorizationId === guard.getId()) {
		throw new Error(`You can not ${body.action} yourself`);
	}

	const databaseHandler = (defineDatabaseHandler as DatabaseHandler)
	const authorization = await databaseHandler
		.findOneAuthorization(body.authorizationId);
	const providerAccessIndex = authorization?.providerAccesses
		.findIndex((providerAccess) => providerAccess._id.toString() === body.providerAccessId);

	if (!authorization || providerAccessIndex === -1 || providerAccessIndex === undefined) {
		return {
			notFound: true
		}
	}

	const providerAccess = authorization.providerAccesses[providerAccessIndex];

	/**
	 * Keep in mind, the ProviderId and tenantId given
	 * in request headers emits, where the data is stored in the database.
	 *
	 * But to make sure, the user has the permission to ban / unban the provider access,
	 * the ProviderAccess.providerId and ProviderAccess.tenantId must be compared with
	 * the token.
	 */
	if (
		!guard.hasPermissionTo(
			body.action === 'ban' ?
				PermissionId.CAN_BAN_PROVIDER_ACCESS :
				PermissionId.CAN_UNBAN_PROVIDER_ACCESS,
			providerAccess.providerId,
			providerAccess.tenantId) ||
		// Make sure, the user has permissions to ban an admin user
		(
			isAdmin(providerAccess) &&
			!guard.hasPermissionTo(
				body.action === 'ban' ?
					PermissionId.CAN_BAN_ADMIN_PROVIDER_ACCESS :
					PermissionId.CAN_UNBAN_ADMIN_PROVIDER_ACCESS,
				providerAccess.providerId,
				providerAccess.tenantId)
		)
	) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden'
		});
	}

	authorization.providerAccesses[providerAccessIndex].isBanned = body.action === 'ban';

	await databaseHandler.updateAuthorization(authorization);

	return {
		_id: providerAccess._id,
		isBanned: providerAccess.isBanned,
		providerId: providerAccess.providerId,
		tenantId: providerAccess.tenantId,
		roles: providerAccess.roles.map(role => ({
			isAdmin: role.isAdmin
		}))
	}
});

function isAdmin(providerAccess: ProviderAccessDoc) {
	return providerAccess.roles.some(role => role.isAdmin);
}
