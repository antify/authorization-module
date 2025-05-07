import {
  ref,
  watch,
  useFetch,
  computed,
  reactive,
  useRouter,
  showError,
  useNuxtApp,
  useUiClient,
  useAuthResponseErrorHandler,
} from '#imports';
import {
  defineStore, storeToRefs,
} from 'pinia';
import {
  roleClientSchema,
  roleServerSchema,
  type RoleClientType,
  type RoleServerType,
} from '../glue/stores/role-crud';
import {
  type ResponseType as GetRoleResponseType,
  type ResponsePermissionType,
} from '../glue/stores/role-crud/[roleId].get';
import {
  type RoleListingData,
} from '../glue/components/role/roleTable';
import type {
  CrudRoutingOptions, FormFieldType,
} from '@antify/ui-module';

export const useRoleListingStore = defineStore('authorization-module-crud-role-listing', () => {
  const router = useRouter();
  const data = ref<RoleListingData | null>(null);
  const skeleton = ref(true);

  return {
    _refresh: async () => {
      throw new Error('useRoleListingStore is not initialized. Set _refresh property before using it.');
    },
    async refresh(resetPageQuery = true, pageQuery = 'p') {
      if (resetPageQuery) {
        const query = {
          ...router.currentRoute.value.query,
        };

        delete query[pageQuery];

        await router.push({
          ...router.currentRoute.value,
          query,
        });
      }

      await this._refresh();
    },
    data,
    skeleton,
  };
});

export const useDeleteRoleStore = defineStore('authorization-module-crud-role-delete', () => {
  const listingStore = useRoleListingStore();
  const routingStore = useRoleRoutingStore();
  const nuxtApp = useNuxtApp();
  const entityIdToDelete = ref<string | null>(null);
  const fetch = useFetch(
    () => `/api/authorization-module/stores/role-crud/${entityIdToDelete.value}`,
    {
      method: 'delete',
      immediate: false,
      watch: false,
      onResponse({
        response,
      }) {
        useAuthResponseErrorHandler(response);

        if (response.status === 200) {
          listingStore.refresh(false);
          routingStore.routing.goToListingPage();
          nuxtApp.$uiModule.toaster.toastDeleted();
        }
      },
    },
  );

  watch(fetch.error, (e) => showError(e));

  return {
    execute: (id: string) => {
      entityIdToDelete.value = id;

      return fetch.execute();
    },
    status: fetch.status,
    loading: computed(() => fetch.status.value === 'idle' || fetch.status.value === 'pending'),
  };
});

export const useRoleDetailStore = defineStore('authorization-module-crud-role-detail', () => {
  const nuxtApp = useNuxtApp();
  const uiClient = useUiClient();
  const routingStore = useRoleRoutingStore();
  const listingStore = useRoleListingStore();
  const {
    status: deleteStatus,
  } = storeToRefs(useDeleteRoleStore());
  const entity = ref<RoleClientType>(roleClientSchema.cast({}));
  const allPermissions = ref<ResponsePermissionType[]>([]);
  const {
    status: saveStatus,
    execute: executeSave,
    error: saveError,
  } = useFetch<RoleServerType>(
    () => '/api/authorization-module/stores/role-crud',
    {
      method: 'post',
      immediate: false,
      watch: false,
      onRequest(request) {
        request.options.body = roleServerSchema.cast(entity.value);
      },
      async onResponse({
        response,
      }) {
        await uiClient.handler.handleNotFoundResponse(response, routingStore.routing.getListingRoute());
        useAuthResponseErrorHandler(response);

        if (response.status === 200) {
          if (entity.value._id === null) {
            routingStore.routing.goToDetailPage(response._data._id);
          }

          entity.value = response._data;
          listingStore.refresh(false);
          nuxtApp.$uiModule.toaster.toastUpdated();
        }
      },
    },
  );

  watch(saveError, (e) => showError(e));

  const formDisabled = computed(() => uiClient.utils.isFormDisabled([
    saveStatus,
    deleteStatus,
  ]));
  const forms = reactive<Record<string, FormFieldType[]>>({
    mainData: [],
  });
  const skeleton = ref<boolean>(false);
  const roleId = ref<string | null>(null);
  const {
    execute,
    error,
  } = useFetch<GetRoleResponseType | {
    notFound: true;
  }>(
    () => `/api/authorization-module/stores/role-crud/${roleId.value}`,
    {
      immediate: false,
      watch: false,
      onRequest() {
        skeleton.value = true;
        entity.value = roleClientSchema.cast({});
      },
      async onResponse({
        response,
      }) {
        await uiClient.handler.handleNotFoundResponse(response, routingStore.routing.getListingRoute());
        useAuthResponseErrorHandler(response);

        if (response.status === 200) {
          entity.value = response._data.role;
          allPermissions.value = response._data.allPermissions;
        }

        skeleton.value = false;
      },
    },
  );

  watch(error, (e) => showError(e));

  return {
    allPermissions,
    async fetchEntity() {
      roleId.value = routingStore.routing.getEntityId() as string;

      await execute();
    },
    skeleton,
    forms,
    /**
     * Reset all errors in all fields of all forms
     */
    resetForms: () => {
      Object.values(forms)
        .forEach(form => form.forEach(field => {
          field.errors = [];
        }));
    },
    resetData: () => {
      entity.value = roleClientSchema.cast({});
    },
    entity,
    formDisabled,
    save: async () => {

      // If the role press enter fast time twice, prevent a second submit
      if (formDisabled.value) {
        return;
      }

      // Validate all fields of all forms
      await Promise.all(Object.values(forms)
        .map(form => form.map(field => field.validate())));

      // Check if any field has errors
      if (Object.values(forms).some(form => form.some(field => field.errors.length > 0))) {
        return nuxtApp.$uiModule.toaster.toastInfo('The form contains errors.\nPlease fix them before submitting.');
      }

      await executeSave();
    },
    async saveAndNew() {
      await this.save();
      this.resetData();
      await routingStore.routing.goToDetailPage();
    },
  };
});

export const useRoleRoutingStore = defineStore('authorization-module-crud-role-routing', () => {
  const options = ref<CrudRoutingOptions | null>(null);

  return {
    options,
    routing: computed(() => {
      if (!options.value) {
        throw new Error('useRoleRoutingStore is not initialized. Set options property before using it.');
      }

      return useUiClient().utils.useCrudRouting(
        options.value.detailRouteName,
        options.value.listingRouteName,
        options.value.getDetailRouteParams,
        options.value.getListingRouteParams,
        options.value.entityIdentifier,
        options.value.createEntityIdentifier,
      );
    }),
  };
});
