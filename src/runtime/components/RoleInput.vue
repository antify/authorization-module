<script lang="ts" setup>
import {onMounted, computed, onUnmounted, useAppContext} from '#imports';
import {useRoleInputStore} from '../stores/roleInput';

const props = defineProps<{
  /**
   * Array of role id's
   */
  modelValue: string[]
  appId?: string
  tenantId?: string
}>();
const roleStore = useRoleInputStore();
const appContext = useAppContext();
const _appId = computed<string>(() => {
  if (props.appId !== undefined) {
    return props.appId;
  }

  if (appContext.value.context.appId === null) {
    throw new Error('App id is not set in app context. To make the RoleInput work, you need ' +
      'to set the app context or pass it as a prop.');
  }

  return appContext.value.context.appId;
});
const _tenantId = computed<string | null>(() => {
  if (props.tenantId !== undefined) {
    return props.tenantId;
  }

  return appContext.value.context.tenantId;
});
const emit = defineEmits(['update:modelValue']);
const roleFetch = roleStore.getFetch(_appId.value, _tenantId.value);
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: string[]) => emit('update:modelValue', value)
});
const options = computed(() => (roleFetch.data.value || []).map((role) => ({
  label: role.name,
  value: role._id
})));

onMounted(() => roleFetch.execute(_appId.value, _tenantId.value));
onUnmounted(() => roleStore.deleteFetch(_appId.value, _tenantId.value));
</script>

<template>
  <AntTagInput
    v-model="_modelValue"
    :skeleton="['pending', 'idle'].includes(roleFetch.status.value)"
    :options="options"
    placeholder="Add role"
  />
</template>
