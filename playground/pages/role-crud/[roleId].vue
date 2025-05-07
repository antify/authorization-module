<script lang="ts" setup>
import {
  definePageMeta,
} from '#imports';

definePageMeta({
  pageTransition: {
    // using false does not work
    name: 'noop',
  },
  layoutTransition: {
    // using false does not work
    name: 'noop',
  },
});
</script>

<template>
  <AuthorizationModuleRoleDetailPage>
    <NuxtPage />
  </AuthorizationModuleRoleDetailPage>
</template>
