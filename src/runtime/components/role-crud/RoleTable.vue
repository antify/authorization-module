<script lang="ts" setup>
import {
  useRoleListingStore,
  useRoleRoutingStore,
  useDeleteRoleStore,
} from '../../stores/roleCrud';
import {
  onMounted,
  ref,
  useRoute,
  computed,
  useRouter,
  useFetch,
  useAuthResponseErrorHandler,
  showError,
  watch,
} from '#imports';
import {
  AntTableRowTypes, Size, InputState, AntTooltip, AntTable,
} from '#ui-module';
import {
  type RoleClientType,
} from '../../glue/stores/role-crud';
import {
  type RoleListingData,
} from '../../glue/components/role/roleTable';
import {
  AntDeleteDialog,
  AntEditButton,
  AntDeleteButton,
} from '@antify/default-template';

const props = withDefaults(defineProps<{
  showLightVersion: boolean;
  canEdit?: boolean;
  editTooltipMessage?: string;
}>(), {
  canEdit: true,
  editTooltipMessage: undefined,
});

const route = useRoute();
const router = useRouter();
const query = computed(() => router.currentRoute.value.query);
const listingStore = useRoleListingStore();
const deleteStore = useDeleteRoleStore();
const fetch = useFetch<RoleListingData>(
  '/api/authorization-module/components/role-crud/role-table',
  {
    query,
    watch: false,
    immediate: false,
    onResponse({
      response,
    }) {
      switch (response.status) {
        case 200:
          break;
        case 401:
        case 403:
          useAuthResponseErrorHandler(response);
          break;
        default:
          showError(response._data);
      }

      listingStore.skeleton = false;
    },
  },
);

watch(fetch.data, (val) => listingStore.data = val);

listingStore._refresh = fetch.refresh;
listingStore.skeleton = true;

const routingStore = useRoleRoutingStore();
const deleteDialogOpen = ref(false);
const entityToDelete = ref<RoleClientType | null>(null);
const tableHeaders = [
  {
    title: 'Name',
    identifier: 'name',
    toProp: 'link',
    type: AntTableRowTypes.link,
    lightVersion: true,
  },
  {
    identifier: 'actions',
    type: AntTableRowTypes.slot,
  },
];
const selectedRow = computed(() => route.params.roleId ? fetch.data.value?.roles?.find((role) => role._id === route.params.roleId) : undefined);
const roles = computed(() => {
  return fetch.data.value?.roles?.map((role) => {
    role.link = routingStore.routing.getDetailRoute(role._id);

    return role;
  }) || [];
});

onMounted(async () => {
  await fetch.execute();
});

function openDeleteEntity(entity: RoleClientType) {
  entityToDelete.value = entity;
  deleteDialogOpen.value = true;
}

async function deleteEntity() {
  if (entityToDelete.value?._id) {
    await deleteStore.execute(entityToDelete.value._id);
    entityToDelete.value = null;
  }
}

const handleEditClick = (entity: {
  _id: string;
}) => {

  const routeConfig = routingStore.routing.getDetailSubRoute(
    entity._id,
    'main-data',
  );

  router.push(routeConfig);
};

</script>

<template>
  <AntTable
    :selected-row="selectedRow"
    :data="roles"
    :headers="tableHeaders"
    :loading="fetch.status.value === 'pending' || fetch.status.value === 'idle'"
    :show-light-version="showLightVersion"
  >
    <template #cellContent="{header, element}">
      <div
        v-if="header.identifier === 'actions'"
        class="flex justify-end gap-2.5"
      >
        <AntEditButton
          icon-variant
          :size="Size.xs"
          @click="handleEditClick(element)"
        />

        <AntDeleteButton
          icon-variant
          :size="Size.xs"
          :disabled="!canEdit"
          :delete-tooltip-message="editTooltipMessage"
          @click="() => openDeleteEntity(element)"
        />
      </div>
    </template>
  </AntTable>

  <AntDeleteDialog
    v-model:open="deleteDialogOpen"
    :entity="`${entityToDelete?.name}`"
    @confirm="deleteEntity"
  />
</template>
