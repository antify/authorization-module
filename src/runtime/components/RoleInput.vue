<script lang="ts" setup>
import {onMounted, computed, onUnmounted} from '#imports';
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
const emit = defineEmits(['update:modelValue']);
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: string[]) => emit('update:modelValue', value)
});

onMounted(() => roleStore.execute());
</script>

<template>
  <AntTagInput
    v-model="_modelValue"
    :skeleton="['pending', 'idle'].includes(roleStore.status.value)"
    :options="roleStore.data || []"
    placeholder="Add role"
  />
</template>
