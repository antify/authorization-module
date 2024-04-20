<script setup lang="ts">
const getDetailRoute = (roleId) => ({
  name: 'roles-roleId',
  params: { roleId },
  query: useRoute().query
})
const getListingRoute = () => ({
  name: 'roles',
  query: useRoute().query
})
</script>

<template>
  <AntAuthCreateRolePage
    provider="core"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
