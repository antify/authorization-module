<script lang="ts" setup>
import {definePageMeta, useRouteGuard, useAppContext} from '#imports';
import {PermissionId} from '../../../src/runtime/permissions';

const listingRouteName = 'crud-role-crud-single-tenancy';
const detailRouteName = 'crud-role-crud-single-tenancy-roleId';

definePageMeta({
  middleware: [
    function () {
      return useRouteGuard({
        appId: 'core',
        tenantId: null
      }, PermissionId.CAN_READ_ROLE);
    }
  ]
});

useAppContext().value.setContext('core');
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
