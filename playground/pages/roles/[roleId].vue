<script setup lang='ts'>
definePageMeta({
	layout: 'unprotected'
})

const getDetailRoute = (roleId) => ({
  name: 'roles-roleId',
  params: { roleId },
  query: useRoute().query
})
const getListingRoute = () => ({ name: 'roles' })
</script>

<template>
  <AntAuthRoleDetailPage
    :role-id="$route.params.roleId"
    provider="core"
    :get-detail-route="getDetailRoute"
    :get-listing-route="getListingRoute"
  />
</template>
