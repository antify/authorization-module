<script setup lang='ts'>
const tenantId = useRoute().params.tenantId;
const getDetailRoute = (roleId) => ({
  name: 'tenantId-roles-roleId',
  params: { tenantId, roleId },
  query: useRoute().query
});
const getListingRoute = () => ({
  name: 'tenantId-roles',
  params: { tenantId },
  query: useRoute().query
});
</script>

<template>
  <div>
    <AntAuthRoleDetailPage
      :role-id="$route.params.roleId"
      provider="tenant"
      :tenant-id="tenantId"
      :get-detail-route="getDetailRoute"
      :get-listing-route="getListingRoute"
    />
  </div>
</template>
