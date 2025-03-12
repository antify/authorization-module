import {
  useFetch,
  showError
} from '#imports';
import {defineStore} from 'pinia';

export const useRoleInputStore = defineStore('authorization-module-role-input', () => {
  const {
    data,
    execute,
    status
  } = useFetch(
    '/api/authorization-module/stores/role-input',
    {
      watch: false,
      immediate: false,
      dedupe: 'defer',
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
    data,
    execute,
    status
  };
});
