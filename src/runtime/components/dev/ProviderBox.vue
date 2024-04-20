<script lang='ts' setup>
import {type Permission} from '../../types';
import {faMultiply} from '@fortawesome/free-solid-svg-icons';
import {withDefaults, computed} from 'vue';

const emit = defineEmits([
	'update:providerId',
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
	providerId: string
	tenantId?: string
	skeleton: boolean
	allPermissions: Permission[]
}>(), {
	permissions: () => [],
	tenantId: '',
	skeleton: false
});

const allPermissions = computed(() => {
	return props.allPermissions.map((item: Permission) => ({
		value: item.id,
		label: item.name
	})) || [];
});
const _permissions = computed({
	get() {
		return props.permissions;
	},
	set(val) {
		emit('update:permissions', val);
	}
});
const _providerId = computed({
	get() {
		return props.providerId;
	},
	set(val) {
		emit('update:providerId', val);
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

function selectAll() {
	emit('update:permissions', allPermissions.value.map((permission) => permission.value));
}

function unselectAll() {
	emit('update:permissions', []);
}
</script>

<template>
  <div class="bg-neutral-100 p-2 rounded flex flex-col space-y-2 border border-neutral-300">
    <div class="flex justify-end">
      <AntButton
        :icon-left="faMultiply"
        size="sm"
        outlined
        :skeleton="skeleton"
        @click="() => $emit('remove')"
      />
    </div>

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

    <AntTextInput
      v-model="_providerId"
      :skeleton="skeleton"
      label="Provider ID"
      autofocus
    />

    <AntTextInput
      v-model="_tenantId"
      :skeleton="skeleton"
      label="Tenant ID"
    />

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
        :checkboxes="allPermissions"
      />
    </div>
  </div>
</template>
