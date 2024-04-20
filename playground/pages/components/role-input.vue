<script lang="ts" setup>
import {ref} from 'vue'
import {TEST_TENANT_ID} from '../../server/datasources/db/core/fixture-utils/tenant';

const selectedRoles = ref([])
</script>

<template>
  <AntFormGroup class="p-2.5">
    <AntAuthRoleInput
      v-model="selectedRoles"
      label="Core roles"
      provider="core"
    />

    <AntAuthRoleInput
      v-model="selectedRoles"
      label="Tenant roles"
      provider="tenant"
      :tenant-id="TEST_TENANT_ID"
    />
  </AntFormGroup>
</template>
