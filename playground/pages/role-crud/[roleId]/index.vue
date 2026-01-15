<script lang="ts" setup>
import {
  definePageMeta,
  navigateTo,
} from '#imports';

definePageMeta({
  middleware: [
    async function (to) {
      return navigateTo({
        ...to,
        name: 'role-crud-roleId-main-data',
      });
    },
  ],
});
</script>

<template>
</template>
