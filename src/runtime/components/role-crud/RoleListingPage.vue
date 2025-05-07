<script setup lang="ts">
import RoleTable from './RoleTable.vue';
import {
  useRoleListingStore,
  useRoleRoutingStore,
  useRoleDetailStore,
} from '../../stores/roleCrud';
import type {
  RouteParams,
} from '#vue-router';
import {
  useGuard,
} from '#imports';
import {
  PermissionId,
} from '../../permissions';

const props = defineProps<{
  detailRouteName: string;
  listingRouteName: string;
  getDetailRouteParams?: () => RouteParams;
  getListingRouteParams?: () => RouteParams;
  entityIdentifier?: string;
  createEntityIdentifier?: string;
}>();
const routingStore = useRoleRoutingStore();
const listingStore = useRoleListingStore();
const detailStore = useRoleDetailStore();
const guard = useGuard();

routingStore.options = props;

function onCreate() {
  detailStore.resetData();
  routingStore.routing.goToDetailPage();
}
</script>

<template>
  <AntCrud :show-detail="routingStore.routing.isDetailPage.value">
    <template #search-section>
      <AntCrudTableFilter
        :full-width="routingStore.routing.isListingPage.value"
        :skeleton="listingStore.skeleton"
        :can-delete="guard.hasPermissionTo(PermissionId.CAN_DELETE_ROLE)"
        :show-filter="false"
        @search="() => listingStore.refresh()"
        @create="onCreate"
      />
    </template>

    <template #table-section>
      <RoleTable :show-light-version="routingStore.routing.isDetailPage.value" />
    </template>

    <template #table-nav-section>
      <AntCrudTableNav
        :count="listingStore.data?.count || 0"
        :full-width="routingStore.routing.isListingPage.value"
        :skeleton="listingStore.skeleton"
        @change-items-per-page="() => listingStore.refresh()"
        @change-page="() => listingStore.refresh(false)"
      />
    </template>

    <slot />
  </AntCrud>
</template>
