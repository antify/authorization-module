import {
  defineEventHandler,
  createError,
  type H3Event,
} from 'h3';

export interface SecurityRule {
  pattern: RegExp;
  method?: string;
  handler?: (event: H3Event) => Promise<void> | void;
}

export const defineSecurityMiddleware = (rules: SecurityRule[]) => {
  return defineEventHandler(async (event) => {
    const path = event.path.split('?')[0];

    if (!path.startsWith('/api/')) {
      return;
    }

    const method = event.method;

    const rule = rules.find((r) => {
      const pathMatch = r.pattern.test(path);
      const methodMatch = !r.method || r.method === method;

      return pathMatch && methodMatch;
    });

    if (!rule) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Access Denied: No security rule found',
      });
    }

    if (rule.handler) {
      await rule.handler(event);
    }
  });
};
