<script setup lang='ts'>
import {useRoute} from '#imports';

const tenantId = useRoute().params.tenantId;
const getDetailRoute = (roleId) => ({
  name: 'tenantId-roles-roleId',
  params: {tenantId, roleId},
  query: useRoute().query
});
const getListingRoute = () => ({
  name: 'tenantId-roles',
  params: {tenantId},
  query: useRoute().query
});
</script>

<template>
  <div>
    <AuthorizationModuleRoleDetailPage
      :role-id="$route.params.roleId"
      app="tenant"
      :tenant-id="tenantId"
      :get-detail-route="getDetailRoute"
      :get-listing-route="getListingRoute"
    />
  </div>
</template>
