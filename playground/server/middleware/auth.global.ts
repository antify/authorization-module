import {
  isAuthorizedHandler, isLoggedInHandler,
} from '#authorization-module';
import type {
  SecurityRule,
} from '#authorization-module';
import {
  PermissionId,
} from '../../shared/permissions';
import {
  readBody, H3Event,
} from 'h3';
import {
  defineSecurityMiddleware,
} from '#imports';

const SECURITY_RULES: SecurityRule[] = [
  {
    pattern: /^\/api\/pages\/get-secret-data$/,
    method: 'GET',
    handler: async (event: H3Event) => {
      await isAuthorizedHandler(event, PermissionId.CAN_READ_SECRET_DATA);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/components\/role-crud\/role-table$/,
    method: 'GET',
    handler: async (event: H3Event) => {
      await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-crud$/,
    method: 'POST',
    handler: async (event) => {
      const body = await readBody(event);

      event.context.body = body;

      const permission = body?._id ? PermissionId.CAN_UPDATE_ROLE : PermissionId.CAN_CREATE_ROLE;

      await isAuthorizedHandler(event, permission);
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

      await isAuthorizedHandler(event, permission);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-input$/,
    method: 'GET',
    handler: async (event: H3Event) => {
      await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/stores\/role-crud\/([a-z0-9]+)$/,
    method: 'GET',
    handler: async (event: H3Event) => {
      await isAuthorizedHandler(event, PermissionId.CAN_READ_ROLE);
    },
  },
  {
    pattern: /^\/api\/authorization-module\/dev\/jwt-form\/app-data$/,
    method: 'GET',
  },
  {
    pattern: /^\/api\/authorization-module\/dev\/jwt-form\/create-jwt$/,
    method: 'POST',
  },
  {
    pattern: /^\/api\/server-side\/users$/,
    method: 'GET',
    handler: async (event: H3Event) => {
      await isLoggedInHandler(event);
    },
  },
  {
    pattern: /^\/api\/server-side\/login$/,
    method: 'POST',
    handler: async (event: H3Event) => {
      await isLoggedInHandler(event);
    },
  },
  {
    pattern: /^\/api\/pages\/components\/ban-buttons\/users$/,
    method: 'GET',
    handler: async (event: H3Event) => {
      await isLoggedInHandler(event);
    },
  },
];

export default defineSecurityMiddleware(SECURITY_RULES);
