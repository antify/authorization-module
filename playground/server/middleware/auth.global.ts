import {
  isAuthorizedHandler,
} from '#authorization-module';
import {
  createError,
} from '#imports';
import {
  PermissionId,
} from '../../glue/permissions';
import {
  defineEventHandler, readBody, H3Event
} from 'h3';

interface SecurityRule {
  pattern: RegExp;
  method?: string;
  handler: (event: H3Event) => Promise<any>;
}

const SECURITY_RULES: SecurityRule[] = [
  {
    pattern: /^\/api\/pages\/get-secret-data$/,
    method: 'GET',
    handler: async (event: H3Event) => isAuthorizedHandler(event, PermissionId.CAN_READ_SECRET_DATA),
  },
  {
    pattern: /^\/api\/authorization-module\/components\/role-crud\/role-table$/,
    method: 'GET',
    handler: async (event: H3Event) => isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE),
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-crud$/,
    method: 'POST',
    handler: async (event) => {
      const body = await readBody(event);

      event.context.body = body;

      const permission = body?._id ? PermissionId.CAN_UPDATE_ROLE : PermissionId.CAN_CREATE_ROLE;

      return isAuthorizedHandler(event, permission);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-crud\/[a-zA-Z0-9_-]+$/,
    method: 'DELETE',
    handler: async (event: H3Event) => isAuthorizedHandler(event, PermissionId.CAN_DELETE_ROLE),
  },
  {
    pattern: /^\/api\/authorization-module\/maybe-components\/ban-authorization-button\/change-ban-status$/,
    method: 'POST',
    handler: async (event) => {
      const body = await readBody(event);
      event.context.body = body;

      const permission = body.action === 'ban' ? PermissionId.CAN_BAN_AUTHORIZATION : PermissionId.CAN_UNBAN_AUTHORIZATION;

      return isAuthorizedHandler(event, permission);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-input$/,
    method: 'GET',
    handler: async (event: H3Event) => isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE),
  },
];

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0];

  if (!path.startsWith('/api/')) {
    return;
  }

  const method = event.method;

  const rule = SECURITY_RULES.find((r) => {
    const pathMatch = r.pattern.test(path);
    const methodMatch = !r.method || r.method === method;

    return pathMatch && methodMatch;
  });

  if (!rule) {
    return;
  }

  let requiredPermission: string | string[];

  if (!rule) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Access Denied',
    });
  }

  await rule.handler(event);
});
