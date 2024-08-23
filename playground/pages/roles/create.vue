<script setup lang="ts">
import {useRoute} from '#imports';

const route = useRoute();
const getDetailRoute = (roleId) => ({
  name: 'roles-roleId',
  params: {roleId},
  query: route.query
});
const getListingRoute = () => ({
  name: 'roles',
  query: route.query
});
</script>

<template>
  <AuthorizationModuleCreateRolePage
    app="core"
    :get-listing-route="getListingRoute"
    :get-detail-route="getDetailRoute"
  />
</template>
