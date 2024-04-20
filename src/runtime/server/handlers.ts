import {type H3Event} from 'h3';
import {useAuth} from './auth';
import * as jose from 'jose';
import {Guard} from '../guard';
import {createError} from '#imports';
import {getContext} from '#database-module';

export const isLoggedInHandler = async (event: H3Event): Promise<Guard> => {
	let guard: Guard;

	try {
		guard = await useAuth().verify(event);
	} catch (e) {
		if (!(e instanceof jose.errors.JOSEError)) {
			throw e;
		}

		// TODO:: log into security log
		console.log(e.code);

		throw createError({
			statusCode: 401,
			statusMessage: 'Unauthorized'
		});
	}

	return guard;
};

export const isAuthorizedHandler = async (
	event: H3Event,
	permissions: string | string[]
): Promise<Guard> => {
	const {provider, tenantId} = getContext(event);
	const guard = await isLoggedInHandler(event);

	if (!provider) {
		throw createError('Missing required provider');
	}

	if (!guard.hasPermissionTo(permissions, provider, tenantId)) {
		throw createError({
			statusCode: 403,
			statusMessage: 'Forbidden'
		});
	}

	return guard;
};
