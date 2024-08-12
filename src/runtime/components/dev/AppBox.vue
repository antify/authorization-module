<script lang='ts' setup>
import {type App, type Permission} from '../../types';
import {faMultiply} from '@fortawesome/free-solid-svg-icons';
import {withDefaults, computed} from 'vue';
import {onMounted} from '#imports';

const emit = defineEmits([
  'update:appId',
  'update:tenantId',
  'update:permissions',
  'update:isAdmin',
  'update:isBanned',
  'remove'
]);
const props = withDefaults(defineProps<{
  isAdmin: boolean
  isBanned: boolean
  permissions: string[]
  appId: string
  tenantId: string | null
  skeleton: boolean
  allPermissions: Permission[]
  allApps: App[]
}>(), {
  permissions: () => [],
  skeleton: false
});

function getAppsPermissions(appId: string) {
  return props.allPermissions
    .filter(permission => permission.appIds === undefined || permission.appIds.some(_appId => _appId === appId));
}

const appsPermissionsCheckboxes = computed(() => {
  return getAppsPermissions(props.appId)
    .map((item: Permission) => ({
      value: item.id,
      label: item.name
    }));
});
const _permissions = computed({
  get() {
    return props.permissions;
  },
  set(val) {
    emit('update:permissions', val);
  }
});
const _appId = computed({
  get() {
    return props.appId;
  },
  set(val) {
    // Unselect all permissions, the new app is not allowed to have.
    const appsPermissions = getAppsPermissions(val);

    emit('update:permissions', props.permissions.filter(permission => appsPermissions.some(_permission => _permission.id === permission)));

    // Empty tenant id if the new app is not multi tenant.
    if (!props.allApps.find(app => app.id === val)?.isMultiTenant) {
      _tenantId.value = null;
    }

    emit('update:appId', val);
  }
});
const _tenantId = computed({
  get() {
    return props.tenantId;
  },
  set(val) {
    emit('update:tenantId', val);
  }
});
const _isAdmin = computed({
  get() {
    return props.isAdmin;
  },
  set(val) {
    emit('update:isAdmin', val);
  }
});
const _isBanned = computed({
  get() {
    return props.isBanned;
  },
  set(val) {
    emit('update:isBanned', val);
  }
});
const allAppsOptions = computed(() => {
  return props.allApps.map((app) => ({
    value: app.id,
    label: app.id
  }));
});
const isMultiTenant = computed(() => props.allApps.find(app => app.id === props.appId)?.isMultiTenant || false);

function selectAll() {
  emit('update:permissions', appsPermissionsCheckboxes.value.map((permission) => permission.value));
}

function unselectAll() {
  emit('update:permissions', []);
}

onMounted(() => {
  // Make sure one valid app is selected per default.
  if (!props.allApps.some(app => app.id === props.appId) && props.allApps[0]) {
    _appId.value = props.allApps[0].id;
  }
});
</script>

<template>
  <AntCard>
    <AntFormGroup>
      <div class="flex justify-end">
        <AntButton
          :icon-left="faMultiply"
          size="sm"
          outlined
          :skeleton="skeleton"
          @click="() => $emit('remove')"
        />
      </div>

      <AntSelect
        v-model="_appId"
        :options="allAppsOptions"
        :skeleton="skeleton"
        label="App ID"
      />

      <AntTextInput
        v-model="_tenantId"
        :skeleton="skeleton"
        :disabled="!isMultiTenant"
        label="Tenant ID"
      />

      <AntFormGroup direction="row">
        <AntSwitch
          v-model="_isAdmin"
          :skeleton="skeleton"
          label="Admin"
        />

        <AntSwitch
          v-model="_isBanned"
          :skeleton="skeleton"
          label="Banned"
        />
      </AntFormGroup>

      <div>
        <AntField
          label="Permissions"
          :skeleton="skeleton"
        >
          <div class="mb-2 flex space-x-2.5">
            <AntButton
              size="sm"
              :skeleton="skeleton"
              @click="selectAll"
            >
              Select all
            </AntButton>

            <AntButton
              size="sm"
              :skeleton="skeleton"
              @click="unselectAll"
            >
              Unselect all
            </AntButton>
          </div>
        </AntField>

        <AntCheckboxGroup
          v-model="_permissions"
          :skeleton="skeleton"
          :checkboxes="appsPermissionsCheckboxes"
        />
      </div>
    </AntFormGroup>
  </AntCard>
</template>
