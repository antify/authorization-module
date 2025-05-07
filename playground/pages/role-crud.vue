<script lang="ts" setup>
import {
  definePageMeta, useRouteGuard,
} from '#imports';
import {
  PermissionId,
} from '../../src/runtime/permissions';

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
</script>

<template>
  <AuthorizationModuleRoleListingPage
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'roleId'"
    :get-detail-route="(roleId) => ({ name: detailRouteName, params: { roleId } })"
    :get-listing-route="() => ({ name: listingRouteName })"
  >
    <NuxtPage />
  </AuthorizationModuleRoleListingPage>
</template>
