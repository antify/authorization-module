import {
  isAuthorizedHandler,
} from '#authorization-module';
import {
  PermissionId,
} from '../../glue/permissions';
import {
  defineEventHandler, readBody,
} from 'h3';

interface SecurityRule {
  pattern: RegExp;
  method?: string;
  handler: string | string[] | ((event: any) => Promise<string | string[]>);
}

const SECURITY_RULES: SecurityRule[] = [
  {
    pattern: /^\/api\/pages\/get-secret-data$/,
    method: 'GET',
    handler: PermissionId.CAN_READ_SECRET_DATA,
  },
  {
    pattern: /^\/api\/authorization-module\/components\/role-crud\/role-table$/,
    method: 'GET',
    handler: PermissionId.CAN_READ_ROLE,
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-crud$/,
    method: 'POST',
    handler: async (event) => {
      const body = await readBody(event);

      event.context.body = body;

      return body._id === null ? PermissionId.CAN_CREATE_ROLE : PermissionId.CAN_UPDATE_ROLE;
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-crud\/[a-zA-Z0-9_-]+$/,
    method: 'DELETE',
    handler: PermissionId.CAN_DELETE_ROLE,
  },
  {
    pattern: /^\/api\/authorization-module\/maybe-components\/ban-authorization-button\/change-ban-status$/,
    method: 'POST',
    handler: async (event) => {
      const body = await readBody(event);
      event.context.body = body;

      return body.action === 'ban' ? PermissionId.CAN_BAN_AUTHORIZATION : PermissionId.CAN_UNBAN_AUTHORIZATION;
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-input$/,
    method: 'GET',
    handler: PermissionId.CAN_READ_ROLE,
  },
];

export default defineEventHandler(async (event) => {
  const path = event.path.split('?')[0];
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

  if (typeof rule.handler === 'function') {
    requiredPermission = await rule.handler(event);
  } else {
    requiredPermission = rule.handler;
  }

  await isAuthorizedHandler(event, requiredPermission);
});
