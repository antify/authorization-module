<script lang="ts" setup>
import {TEST_TENANT_ID} from '~/server/datasources/db/core/fixture-utils/tenant';
import {definePageMeta, onBeforeMount, useRouteGuard, useAppContext} from '#imports';
import {PermissionId} from '../../../../src/runtime/permissions';

const listingRouteName = 'crud-tenantId-role-crud-multi-tenancy';
const detailRouteName = 'crud-tenantId-role-crud-multi-tenancy-roleId';
const appContext = useAppContext();

definePageMeta({
  middleware: [
    function () {
      return useRouteGuard({
        appId: 'tenant',
        tenantId: TEST_TENANT_ID
      }, PermissionId.CAN_READ_ROLE);
    }
  ]
});

onBeforeMount(() => {
  appContext.value.setContext('tenant', TEST_TENANT_ID);
});
</script>

<template>
  <AuthorizationModuleRoleListingPage
    :listing-route-name="listingRouteName"
    :detail-route-name="detailRouteName"
    :entity-identifier="'roleId'"
    :get-detail-route="(roleId) => ({ name: detailRouteName, params: { roleId, tenantId: appContext.context.tenantId } })"
    :get-listing-route="() => ({ name: listingRouteName, params: { tenantId: appContext.context.tenantId } })"
  >
    <NuxtPage />
  </AuthorizationModuleRoleListingPage>
</template>
