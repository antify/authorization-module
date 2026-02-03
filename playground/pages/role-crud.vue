<script lang="ts" setup>
import {
  computed,
  definePageMeta, useGuard, useRouteGuard,
} from '#imports';
import {
  PermissionId,
} from '#shared/permissions';

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
const canEdit = computed(() => guard.hasPermissionTo(PermissionId.CAN_EDIT_ROLE));

</script>

<template>
  <AuthorizationModuleRoleListingPage
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'roleId'"
    :get-detail-route="(roleId) => ({ name: detailRouteName, params: { roleId } })"
    :get-listing-route="() => ({ name: listingRouteName })"
    :can-edit="canEdit"
    :edit-tooltip-message="'Insufficient permissions to Edit'"
  >
    <NuxtPage />
  </AuthorizationModuleRoleListingPage>
</template>
