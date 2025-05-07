<script lang='ts' setup>
import {
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import type {
  JsonWebToken,
} from '../../types';
import JWTForm from './JWTForm.vue';
import {
  withDefaults,
} from 'vue';
import {
  ref,
} from '#imports';

if (!import.meta.env.DEV) {
  // TODO:: Just not provide id outside of dev context?
  throw new Error('The JWTHelper is only available in development mode. Remove it from production code.');
}

withDefaults(defineProps<{
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  defaultToken?: Partial<JsonWebToken>;
}>(), {
  position: 'bottom-right',
});
const jwtModalOpen = ref(false);
</script>

<template>
  <div
    class="fixed p-1.5 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center cursor-pointer hover:drop-shadow-lg transition-all"
    :class="{'top-2.5 right-2.5': position === 'top-right', 'bottom-2.5 right-2.5': position === 'bottom-right', 'bottom-2.5 left-2.5': position === 'bottom-left', 'top-2.5 left-2.5': position === 'top-left'}"
    @click="() => jwtModalOpen = !jwtModalOpen"
  >
    <AntIcon
      :icon="faUserShield"
      size="md"
      class="text-neutral-light-font"
    />
  </div>

  <JWTForm
    v-model:open="jwtModalOpen"
    :default-token="defaultToken"
  />
</template>
