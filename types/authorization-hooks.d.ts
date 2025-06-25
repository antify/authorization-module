import type {
  Permission,
} from '../src/runtime/types';

declare module 'nuxt/schema' {
  interface NuxtHooks {
    'authorization-module:add-permissions': (permissions: Permission[]) => void;
  }
}
