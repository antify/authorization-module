<script lang="ts" setup>
/**
 * TODO:: Finish implementation, when https://github.com/antify/ui-module/issues/50 is fixed.
 */
import {onMounted, computed, onUnmounted, useAppContext} from '#imports'
import {useRoleStore} from '../stores/role';

const props = defineProps<{
	/**
	 * Array of role id's
	 */
	modelValue: string[]
	appId?: string
	tenantId?: string
}>();
const roleStore = useRoleStore();
const appContext = useAppContext();
const _appId = computed<string>(() => {
	if (props.appId !== undefined) {
		return props.appId;
	}

	if (appContext.context.value.appId === null) {
		throw new Error('App id is not set in app context. To make the RoleInput work, you need to set the app context or pass it as a prop.');
	}

	return appContext.context.value.appId;
});
const _tenantId = computed<string | null>(() => {
	if (props.tenantId !== undefined) {
		return props.tenantId;
	}

	return appContext.context.value.tenantId;
});
const emit = defineEmits(['update:modelValue']);
const roleFetch = roleStore.getFetch(_appId.value, _tenantId.value);
const _modelValue = computed({
	get: () => props.modelValue,
	set: (value: string[]) => emit('update:modelValue', value)
});
const options = computed(() => (roleFetch.data.value || []).map((role) => ({
	label: role.name,
	value: role.id
})));

onMounted(() => roleFetch.execute(_appId.value, _tenantId.value));
onUnmounted(() => roleStore.deleteFetch(_appId.value, _tenantId.value));
</script>

<template>
  <AntTagInput
    v-model="_modelValue"
    :skeleton="roleFetch.skeleton.value"
    :options="options"
  />
</template>
