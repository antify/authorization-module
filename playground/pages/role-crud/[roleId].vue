<script lang="ts" setup>
import {
  definePageMeta, useGuard, computed,
} from '#imports';
import {
  PermissionId,
} from '#shared/permissions';

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

const guard = useGuard();
const canEdit = computed(() => guard.hasPermissionTo(PermissionId.CAN_EDIT_ROLE));

</script>

<template>
  <AuthorizationModuleRoleDetailPage
    :can-edit="canEdit"
    :edit-tooltip-message="'Insufficient permissions to Edit'"
  >
    <NuxtPage />
  </AuthorizationModuleRoleDetailPage>
</template>
