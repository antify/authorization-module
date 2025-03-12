import defineDatabaseHandler from '#authorization-module-database-handler';
import {Role, ROLE_SCHEMA_NAME} from '../../../datasources/schemas/role';
import {isAuthorizedHandler, isLoggedInHandler} from '../../../handlers';
import {roleServerSchema} from '../../../../glue/stores/role-crud';
import type {DatabaseHandler} from '../../../databaseHandler';
import {defineEventHandler, readBody} from '#imports';
import {PermissionId} from '../../../../permissions';
import {useEventReader} from '../../../utils';
import {Error} from 'mongoose';

export default defineEventHandler(async (event) => {
  await isLoggedInHandler(event);

  const body = await roleServerSchema
    .validate(await readBody(event), {strict: true, stripUnknown: true});

  await isAuthorizedHandler(event, body._id === null ? PermissionId.CAN_CREATE_ROLE : PermissionId.CAN_UPDATE_ROLE);

  const client = await (defineDatabaseHandler as DatabaseHandler)
    .getDatabaseClient(useEventReader().getTenantId(event));
  const RoleModel = client.getModel<Role>(ROLE_SCHEMA_NAME);

  // On update
  if (body._id !== null) {
    const role = await RoleModel.findById(body._id);

    if (!role) {
      return {
        notFound: true
      };
    }
  }

  const role = new RoleModel<Role>({
    ...body,
    _id: undefined
  });

  // On update
  if (body._id !== null) {
    role.isNew = false;
    role._id = body._id;
  }

  try {
    await role.save();
  } catch (e) {
    if (e?.constructor?.name === Error.DocumentNotFoundError.name) {
      return {
        notFound: true
      };
    }

    throw e;
  }

  return roleServerSchema.cast(role, {stripUnknown: true});
});
