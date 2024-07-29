import {type JsonWebToken} from '#authorization-module';
import {permissions} from './glue/permissions';

export const defaultToken: JsonWebToken = {
  id: 'an-user-id',
  isSuperAdmin: false,
  apps: [
    {
      appId: 'core',
      tenantId: null,
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }, {
      appId: 'tenant',
      tenantId: '63e398316c6c22a1f5479ab6',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }
  ]
};
