import {type H3Event, getCookie} from 'h3';
import {useRuntimeConfig} from '#imports';

/**
 * Graph values from request event.
 */
export const useEventReader = () => {
  const {
    tokenCookieName,
    tenantIdCookieName
  } = useRuntimeConfig().public.authorizationModule;

  return {
    getTenantId: (event: H3Event): string | null => {
      return getCookie(event, tenantIdCookieName) || null;
    },
    getToken: (event: H3Event) => {
      return event.headers['authorization'] || getCookie(event, tokenCookieName);
    }
  };
};
