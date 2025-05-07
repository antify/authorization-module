<script lang="ts" setup>
import {
  ref, useRouter,
} from '#imports';

const selectedRoles1 = ref([]);
const selectedRoles2 = ref([]);
</script>

<template>
  <AntFormGroup class="p-2.5">
    <AuthorizationModuleRoleInput
      v-model="selectedRoles1"
      label="Roles"
      description="This input should show roles"
    />

    <AuthorizationModuleRoleInput
      v-model="selectedRoles2"
      label="Another roles input"
      description="This input should make sure, that not multiple requests get send to the server for same role data"
    />
  </AntFormGroup>
</template>
