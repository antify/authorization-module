import {
  watch,
  useFetch,
  showError,
  useAuthResponseErrorHandler,
} from '#imports';
import {
  defineStore,
} from 'pinia';

export const useRoleInputStore = defineStore('authorization-module-role-input', () => {
  const {
    data,
    execute,
    status,
    error,
  } = useFetch(
    '/api/authorization-module/stores/role-input',
    {
      watch: false,
      immediate: false,
      dedupe: 'defer',
      headers: {
        Accept: 'application/json',
      },
      onResponse({
        response,
      }) {
        useAuthResponseErrorHandler(response);
      },
    },
  );

  watch(error, (e) => showError(e));

  return {
    data,
    execute,
    status,
  };
});
