import {
  watch,
  useFetch,
  showError,
  useAuthResponseErrorHandler,
} from '#imports';
import {
  defineStore,
} from 'pinia';
import type {
  Ref,
} from 'vue';
import {
  type ResponseType as GetRoleInputResponseType,
} from '../glue/stores/role-input';

export const useRoleInputStore = defineStore('authorization-module-role-input', () => {
  const {
    data,
    execute,
    status,
    error,
  } = useFetch<GetRoleInputResponseType>(
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
    data: data as Ref<GetRoleInputResponseType | undefined>,
    execute: async (): Promise<void> => {
      await execute();
    },
    status,
  };
});
