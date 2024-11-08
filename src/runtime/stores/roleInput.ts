import {
  useFetch,
  showError
} from '#imports';
import {defineStore} from 'pinia';

export function useRoleFetch(appId: string, tenantId: string | null) {
  const {
    data,
    execute,
    status
  } = useFetch(
    '/api/authorization-module/stores/role-input',
    {
      query: {
        appId,
        tenantId
      },
      watch: false,
      immediate: false,
      headers: {
        Accept: 'application/json'
      },
      onResponse({response}) {
        // TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
        if (response.status === 500) {
          showError(response._data);
        }
      }
    }
  );

  return {
    execute,
    data,
    status
  };
}

export const useRoleInputStore = defineStore('authorization-module-role-input', () => {
  const state: Record<string, never> = {};

  return {
    getFetch: (appId: string, tenantId: string | null) => {
      if (!state[`${appId}-${tenantId}`]) {
        state[`${appId}-${tenantId}`] = useRoleFetch(appId, tenantId);
      }

      return state[`${appId}-${tenantId}`];
    },
    deleteFetch: (appId: string, tenantId: string | null) => {
      delete state[`${appId}-${tenantId}`];
    }
  };
});
