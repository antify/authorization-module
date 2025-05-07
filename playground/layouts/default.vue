<script setup lang='ts'>
import {
  defaultToken,
} from '../utils';
import {
  SECOND_TEST_TENANT_ID,
  TEST_TENANT_ID,
} from '~/server/datasources/db/fixture-utils/tenant';
import {
  onMounted, useGuard, computed,
} from '#imports';

const navItems = [
  {
    label: 'Home',
    to: {
      name: 'index',
    },
  },
  {
    label: 'Server side',
    to: {
      name: 'server-side',
    },
  },
  {
    label: 'Protected area',
    to: {
      name: 'protected-area',
    },
  },
  {
    label: 'Role CRUD',
    to: {
      name: 'role-crud',
    },
  },
  {
    label: 'Components',
    children: [
      {
        label: 'Ban buttons',
        to: {
          name: 'components-ban-buttons',
        },
      },
      {
        label: 'Role input',
        to: {
          name: 'components-role-input',
        },
      },
      {
        label: 'Jail page',
        to: {
          name: 'components-jail',
        },
      },
    ],
  },
];
const guard = useGuard();
const selectedTenantId = computed<string | null>({
  get() {
    return guard.getTenantId();
  },
  set(value) {
    guard.setTenantId(value);
  },
});

onMounted(() => guard.setTenantId(TEST_TENANT_ID));
</script>

<template>
  <AntNavLeftLayout :navbar-items="navItems">
    <AntContent
      class="h-full flex flex-col"
      :padding="false"
    >
      <div class="border-b border-neutral-300 p-2.5 bg-white flex justify-end">
        <div>
          <AntSelect
            v-model="selectedTenantId"
            description="Emulate the current application to be an instance of a specific tenant."
            :options="[
              {label: `Default tenant (${TEST_TENANT_ID})`, value: TEST_TENANT_ID},
              {label: `Second tenant (${SECOND_TEST_TENANT_ID})`, value: SECOND_TEST_TENANT_ID},
              {label: `Invalid tenant (123456789123456789123457)`, value: '123456789123456789123457'}
            ]"
            placeholder="Null"
            nullable
          />
        </div>
      </div>

      <slot />
    </AntContent>

    <AuthorizationModuleJWTHelper
      :default-token="defaultToken"
      position="bottom-left"
    />

    <AntToaster :toasts="$uiModule.toaster.getToasts()" />
  </AntNavLeftLayout>
</template>
