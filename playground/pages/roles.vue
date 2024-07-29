<script setup lang='ts'>
const getDetailRoute = (roleId) => ({
  name: 'roles-roleId',
  params: {roleId}
});
const getCreateRoute = () => ({name: 'roles-create'});
</script>

<template>
  <div>
    <AuthorizationModuleRoleListingPage
      app="core"
      :table-full-width="$route.name === 'authorization_roles'"
      :get-detail-route="getDetailRoute"
      :get-create-route="getCreateRoute"
    />

    <NuxtPage />
  </div>
</template>
