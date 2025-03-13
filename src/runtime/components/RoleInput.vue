<script lang="ts" setup>
import {onMounted, computed} from '#imports';
import {useRoleInputStore} from '../stores/roleInput';

const props = withDefaults(
  defineProps<{
    /**
     * Array of role id's
     */
    modelValue: string[]
    appId?: string
    tenantId?: string
    disabled?: boolean
    skeleton?: boolean
  }>(),
  {
    disabled: false,
    skeleton: false
  }
);
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
    :skeleton="['pending', 'idle'].includes(roleStore.status.value) || props.skeleton"
    :options="roleStore.data || []"
    :disabled="props.disabled"
    placeholder="Add role"
  />
</template>
