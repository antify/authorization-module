<script setup lang='ts'>
import {definePageMeta, useRoute} from '#imports';

definePageMeta({
  layout: 'unprotected'
});

const getDetailRoute = (roleId) => ({
  name: 'roles-roleId',
  params: {roleId},
  query: useRoute().query
});
const getListingRoute = () => ({name: 'roles'});
</script>

<template>
  <AuthorizationModuleRoleDetailPage
    :role-id="$route.params.roleId"
    app="core"
    :get-detail-route="getDetailRoute"
    :get-listing-route="getListingRoute"
  />
</template>
