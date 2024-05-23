<script setup lang='ts'>
const tenantId = useRoute().params.tenantId;
const getListingRoute = () => ({
  name: 'tenantId-roles',
  params: { tenantId },
  query: useRoute().query
});
const getDetailRoute = (roleId) => ({
  name: 'tenantId-roles-roleId',
  params: { tenantId, roleId },
  query: useRoute().query
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
