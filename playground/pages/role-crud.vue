<script lang="ts" setup>
import {
  computed,
  definePageMeta, useGuard, useRouteGuard,
} from '#imports';
import {
  PermissionId,
} from '../glue/permissions';

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

</script>

<template>
  <AuthorizationModuleRoleListingPage
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'roleId'"
    :get-detail-route="(roleId) => ({ name: detailRouteName, params: { roleId } })"
    :get-listing-route="() => ({ name: listingRouteName })"
    :can-create = "canCreate"
    :can-update = "true"
    :can-delete = "true"
    :create-tooltip-message = "'Not Enough Permissions for using'"
    :update-tooltip-message = "'Not Enough Permissions for using'"
    :delete-tooltip-message = "'Not Enough Permissions for using'"
  >
    <NuxtPage />
  </AuthorizationModuleRoleListingPage>
</template>
