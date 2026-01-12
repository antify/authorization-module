<script lang="ts" setup>
import {
  computed,
  definePageMeta, useGuard, useRouteGuard,
} from '#imports';
import {
  PermissionId,
} from '../shared/permissions';

const listingRouteName = 'role-crud';
const detailRouteName = 'role-crud-roleId';

definePageMeta({
  middleware: [
    function () {
      // TODO:: on a wrong tenantId, this should logout the user
      return useRouteGuard(PermissionId.CAN_READ_ROLE);
    },
  ],
});

const guard = useGuard();
const canCreate = computed(() => guard.hasPermissionTo(PermissionId.CAN_CREATE_ROLE));
const canUpdate = computed(() => guard.hasPermissionTo(PermissionId.CAN_UPDATE_ROLE));
const canDelete = computed(() => guard.hasPermissionTo(PermissionId.CAN_DELETE_ROLE));

</script>

<template>
  <AuthorizationModuleRoleListingPage
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'roleId'"
    :get-detail-route="(roleId) => ({ name: detailRouteName, params: { roleId } })"
    :get-listing-route="() => ({ name: listingRouteName })"
    :can-create="canCreate"
    :can-update="canUpdate"
    :can-delete="canDelete"
    :create-tooltip-message="'Insufficient permissions to Create'"
    :update-tooltip-message="'Insufficient permissions to Update'"
    :delete-tooltip-message="'Insufficient permissions to Delete'"
  >
    <NuxtPage />
  </AuthorizationModuleRoleListingPage>
</template>
