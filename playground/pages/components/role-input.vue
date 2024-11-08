<script lang="ts" setup>
import {TEST_TENANT_ID} from '../../server/datasources/db/core/fixture-utils/tenant';
import {ref, computed, useAppContext, useRouter} from '#imports';
import {Grouped, State} from '#ui-module';

const router = useRouter();
const selectedRoles1 = ref([]);
const selectedRoles2 = ref([]);
const selectedRoles3 = ref([]);
const appContext = useAppContext();

const isCoreAppContext = computed(() => appContext.value.context.appId === 'core');
const isTenantAppContext = computed(() => appContext.value.context.appId === 'tenant');

function setCoreAppContext() {
  appContext.value.setContext('core', null);

  // Refresh the page. RoleInput does not support changing the app context after it has been initialized.
  router.go(0);
}

function setTenantAppContext() {
  appContext.value.setContext('tenant', TEST_TENANT_ID);

  // Refresh the page. RoleInput does not support changing the app context after it has been initialized.
  router.go(0);
}
</script>

<template>
  <AntFormGroup class="p-2.5">
    <AntField
      label="Context switch"
      description="Switch the app context here"
    >
      <AntButton
        :state="isCoreAppContext ? State.primary : State.base"
        :filled="isCoreAppContext"
        :grouped="Grouped.left"
        @click="setCoreAppContext"
      >
        Core
      </AntButton>
      <AntButton
        :state="isTenantAppContext ? State.primary : State.base"
        :filled="isTenantAppContext"
        :grouped="Grouped.right"
        @click="setTenantAppContext"
      >
        Tenant
      </AntButton>
    </AntField>

    <AuthorizationModuleRoleInput
      v-model="selectedRoles1"
      label="Roles from app context"
      description="This input should show roles from the current app context"
    />

    <AuthorizationModuleRoleInput
      v-model="selectedRoles2"
      label="Tenant roles"
      app-id="tenant"
      :tenant-id="TEST_TENANT_ID"
      description="This input should always show roles from the tenant"
    />

    <AuthorizationModuleRoleInput
      v-model="selectedRoles3"
      label="Another tenant roles"
      app-id="tenant"
      :tenant-id="TEST_TENANT_ID"
      description="This input should make sure, that not multiple requests get send to the server for same role data"
    />
  </AntFormGroup>
</template>
