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
  AntCrud,
  AntCrudTableFilter,
  AntCrudTableNav,
  AntCreateButton,
} from '@antify/default-template';
import {
  InputState, AntTooltip,
} from '#ui-module';
import {
  State, AntButton,
} from '@antify/ui';

const props = withDefaults(defineProps<{
  detailRouteName: string;
  listingRouteName: string;
  getDetailRouteParams?: () => RouteParams;
  getListingRouteParams?: () => RouteParams;
  entityIdentifier?: string;
  createEntityIdentifier?: string;
  canEdit?: boolean;
  editTooltipMessage?: string;
}>(), {
  canEdit: true,
  editTooltipMessage: undefined,
});
const routingStore = useRoleRoutingStore();
const listingStore = useRoleListingStore();
const detailStore = useRoleDetailStore();

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
        :can-create="canEdit"
        :show-filter="false"
        :create-tooltip-message="editTooltipMessage"
        @search="() => listingStore.refresh()"
        @create="onCreate"
      />
    </template>

    <template #table-section>
      <RoleTable
        :can-update="canEdit"
        :update-tooltip-message="editTooltipMessage"
        :show-light-version="routingStore.routing.isDetailPage.value"
      />
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
