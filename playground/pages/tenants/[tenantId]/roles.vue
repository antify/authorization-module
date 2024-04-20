<script setup lang='ts'>
const tenantId = useRoute().params.tenantId;
const getCreateRoute = () => ({
  name: 'tenantId-roles-create',
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
  <div>
    <AntAuthRoleListingPage
      provider="tenant"
      :tenant-id="tenantId"
      :table-full-width="$route.name === 'tenantId-roles'"
      :get-detail-route="getDetailRoute"
      :get-create-route="getCreateRoute"
    />

    <NuxtPage />
  </div>
</template>
