<script setup lang='ts'>
import {useRoute} from '#imports';

const route = useRoute();
const tenantId = route.params.tenantId;
const getListingRoute = () => ({
  name: 'tenantId-roles',
  params: {tenantId},
  query: route.query
});
const getDetailRoute = (roleId) => ({
  name: 'tenantId-roles-roleId',
  params: {tenantId, roleId},
  query: route.query
});
</script>

<template>
  <AuthorizationModuleCreateRolePage
    app="tenant"
    :tenant-id="tenantId"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
