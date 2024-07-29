<script lang='ts' setup>
import type {JsonWebToken} from '../../types';
import {faUserShield} from '@fortawesome/free-solid-svg-icons';
import JWTForm from './JWTForm.vue';
import {withDefaults, ref} from 'vue';

if (!import.meta.env.DEV) {
  // TODO:: Just not provide id outside of dev context?
  throw new Error('The JWTHelper is only available in development mode. Remove it from production code.');
}

enum Position {
  topRight = 'top-right',
  bottomRight = 'bottom-right',
  bottomLeft = 'bottom-left',
  topLeft = 'top-left'
}

withDefaults(defineProps<{
  position?: Position
  defaultToken?: Partial<JsonWebToken>
}>(), {
  position: Position.bottomRight
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
