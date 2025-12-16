<script lang="ts" setup>
import {
  definePageMeta, useGuard, computed,
} from '#imports';
import {
  PermissionId,
} from '../../glue/permissions';

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

</script>

<template>
  <AuthorizationModuleRoleDetailPage
    :can-create = "canCreate"
    :can-update = "true"
    :can-delete = "true"
    :create-tooltip-message = "'Not Enough Permissions for using'"
    :update-tooltip-message = "'Not Enough Permissions for using'"
    :delete-tooltip-message = "'Not Enough Permissions for using'"
  >
    <NuxtPage />
  </AuthorizationModuleRoleDetailPage>
</template>
