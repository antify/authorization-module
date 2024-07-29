<script lang="ts" setup>
import {ref} from 'vue';
import {TEST_TENANT_ID} from '../../server/datasources/db/core/fixture-utils/tenant';

const selectedRoles = ref([]);
</script>

<template>
  <AntFormGroup class="p-2.5">
    <div>TODO:: add an app context switcher here</div>

    <AuthorizationModuleRoleInput
      v-model="selectedRoles"
      label="Roles from app context"
      description="This input should show roles from the current app context"
    />

    <AuthorizationModuleRoleInput
      v-model="selectedRoles"
      label="Tenant roles"
      app-id="tenant"
      :tenant-id="TEST_TENANT_ID"
      description="This input should always show roles from the tenant"
    />

    <AuthorizationModuleRoleInput
      v-model="selectedRoles"
      label="Another tenant roles"
      app-id="tenant"
      :tenant-id="TEST_TENANT_ID"
      description="This input should make sure, that not multiple requests get send to the server for same role data"
    />
  </AntFormGroup>
</template>
