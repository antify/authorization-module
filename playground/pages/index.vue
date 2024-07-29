<script lang="ts" setup>
import {PermissionId} from '~/glue/permissions';
import {
  ref,
  useGuard,
  useFetch,
  onMounted,
  useAppContext,
  useAuthResponseErrorHandler
} from '#imports';
import {TagState, AntTagSize} from '#ui-module';

const APP = 'core';
const guard = ref(useGuard());
const statusCode = ref<null | number>(null);
const handleResponseErrors = ref(false);
const appContext = useAppContext();
const {execute, data} = useFetch('/api/pages/get-secret-data', {
  immediate: false,
  onResponse({response}) {
    statusCode.value = response.status;

    if (handleResponseErrors.value) {
      useAuthResponseErrorHandler(response);
    }
  }
});

onMounted(() => {
  appContext.value.setContext(APP);
});
</script>

<template>
  <div class="flex flex-col	gap-5 p-2.5 bg-white h-full overflow-y-auto">
    <div class="text-3xl">Authorization module playground</div>
    <div>
      With this page, you can test if the guard work client- and server side correctly. <br>
      Everything is associated to <strong>{{ APP }}</strong> app.
    </div>

    <div class="flex gap-2.5 w-full">
      <AntFormGroup class="w-1/2">
        <AntFormGroupLabel>Test guard client side</AntFormGroupLabel>

        <AntField label="Is logged in?">
          <AntTag
            :state="guard.isLoggedIn() ? TagState.success : TagState.danger"
            :size="AntTagSize.sm"
          >
            {{ guard.isLoggedIn() }}
          </AntTag>
        </AntField>

        <AntField :label="`Has permission to do ${PermissionId.CAN_READ_SECRET_DATA} in ${APP} app`">
          <AntTag
            :state="guard.hasPermissionTo(PermissionId.CAN_READ_SECRET_DATA, APP) ? TagState.success : TagState.danger"
          >
            {{ guard.hasPermissionTo(PermissionId.CAN_READ_SECRET_DATA, APP) }}
          </AntTag>
        </AntField>

        <AntField
          v-if="guard.token"
          label="Token"
        >
          <pre class="rounded-md bg-neutral-100 p-2.5 overflow-auto">{{ guard.token }}</pre>
        </AntField>
      </AntFormGroup>

      <AntFormGroup class="w-1/2">
        <AntFormGroup>
          <AntFormGroupLabel>Test guard server side</AntFormGroupLabel>

          <AntSwitch
            v-model="handleResponseErrors"
            label="Handle response errors"
            description="Trigger the useAuthResponseErrorHandler on response error"
          />

          <AntField label="Do a protected request">
            <AntActionButton @click="() => execute()">Submit request</AntActionButton>
          </AntField>

          <AntField
            v-if="statusCode"
            label="Status code"
          >
            <AntTag
              :state="statusCode === 200 ? TagState.success : TagState.danger"
            >
              {{ statusCode }}
            </AntTag>
          </AntField>

          <AntField
            v-if="data"
            label="Response"
          >
            <pre class="rounded-md bg-neutral-100 p-2.5 overflow-auto">{{ data }}</pre>
          </AntField>
        </AntFormGroup>
      </AntFormGroup>
    </div>
  </div>
</template>
