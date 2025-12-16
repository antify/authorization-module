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
  AntCreateButton
} from '@antify/default-template';
import {
  InputState, AntTooltip
} from '#ui-module';

const props = withDefaults(defineProps<{
  detailRouteName: string;
  listingRouteName: string;
  getDetailRouteParams?: () => RouteParams;
  getListingRouteParams?: () => RouteParams;
  entityIdentifier?: string;
  createEntityIdentifier?: string;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  createTooltipMessage?: string;
  updateTooltipMessage?: string;
  deleteTooltipMessage?: string;
}>(), {
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  createTooltipMessage: '(Berechtigungsfehler)',
  updateTooltipMessage: '(Berechtigungsfehler)',
  deleteTooltipMessage: '(Berechtigungsfehler)',
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
        :can-create="canCreate"
        :show-filter="false"
        @search="() => listingStore.refresh()"
        @create="onCreate"
      >
      <template #buttons>
        <AntTooltip :state="InputState.base">
          <AntCreateButton
            :skeleton="listingStore.skeleton"
            :disabled="!canCreate"
            @click="onCreate"
          />
          <template
            v-if="!canCreate"
            #content
          >
            <div>
              {{ createTooltipMessage }}
            </div>
          </template>
        </AntTooltip>
      </template>
      </AntCrudTableFilter>
    </template>

    <template #table-section>
      <RoleTable
        :can-update="canUpdate"
        :update-tooltip-message="updateTooltipMessage"
        :can-delete="canDelete"
        :delete-tooltip-message="deleteTooltipMessage"
        :show-light-version="routingStore.routing.isDetailPage.value" />
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
