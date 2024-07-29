<script setup lang='ts'>
import {useRoute} from '#imports';

const route = useRoute();
const tenantId = route.params.tenantId;
const getCreateRoute = () => ({
  name: 'tenantId-roles-create',
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
  <div>
    <AuthorizationModuleRoleListingPage
      app="tenant"
      :tenant-id="tenantId"
      :table-full-width="$route.name === 'tenantId-roles'"
      :get-detail-route="getDetailRoute"
      :get-create-route="getCreateRoute"
    />

    <NuxtPage />
  </div>
</template>
