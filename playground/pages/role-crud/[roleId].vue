<script lang="ts" setup>
import {
  definePageMeta, useGuard, computed,
} from '#imports';
import {
  PermissionId,
} from '../../shared/permissions';

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
const canCreate = computed(() => guard.hasPermissionTo(PermissionId.CAN_CREATE_ROLE));
const canUpdate = computed(() => guard.hasPermissionTo(PermissionId.CAN_UPDATE_ROLE));
const canDelete = computed(() => guard.hasPermissionTo(PermissionId.CAN_DELETE_ROLE));

</script>

<template>
  <AuthorizationModuleRoleDetailPage
    :can-create="canCreate"
    :can-update="canUpdate"
    :can-delete="canDelete"
    :create-tooltip-message="'Insufficient permissions to Create'"
    :update-tooltip-message="'Insufficient permissions to Update'"
    :delete-tooltip-message="'Insufficient permissions to Delete'"
  >
    <NuxtPage />
  </AuthorizationModuleRoleDetailPage>
</template>
