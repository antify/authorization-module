<script lang="ts" setup>
/**
 * TODO:: Finish implementation, when https://github.com/antify/ui-module/issues/50 is fixed.
 */
import {onMounted, computed, onUnmounted} from 'vue'
import {useRoleStore} from '../stores/role';

const props = defineProps<{
	/**
	 * Array of role id's
	 */
	modelValue: string[]
	provider: string
	tenantId?: string
}>();
const emit = defineEmits(['update:modelValue']);
const roleFetch = useRoleStore().getFetch(props.provider, props.tenantId);
const _modelValue = computed({
	get: () => props.modelValue,
	set: (value: string[]) => emit('update:modelValue', value)
});
const options = computed(() => (roleFetch.data.value || []).map((role) => ({
	label: role.name,
	value: role.id
})));

onMounted(() => roleFetch.execute(props.provider, props.tenantId));
onUnmounted(() => useRoleStore().deleteFetch(props.provider, props.tenantId));
</script>

<template>
  <AntTagInput
    v-model="_modelValue"
    :skeleton="roleFetch.skeleton.value"
    :options="options"
  />
</template>
