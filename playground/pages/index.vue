<script lang="ts" setup>
import {ref} from 'vue';
import {PermissionId} from '~/glue/permissions';
import {
	useUi,
	useGuard,
	useAuthResponseErrorHandler,
	useFetch,
	useNuxtApp
} from '#imports';

const {$databaseModule} = useNuxtApp();
const PROVIDER = 'core';
const {ColorType} = useUi();
const guard = ref(useGuard());
const statusCode = ref<null | number>(null);
const handleResponseErrors = ref(false);
const {execute, data} = useFetch('/api/pages/get-secret-data', {
	immediate: false,
	headers: $databaseModule.getContextHeaders(PROVIDER),
	onResponse({response}) {
		statusCode.value = response.status

		if (handleResponseErrors.value) {
			useAuthResponseErrorHandler(response)
		}
	}
});
</script>

<template>
  <div class="flex flex-col	gap-5 p-2.5 bg-white h-full overflow-y-auto">
    <div class="text-3xl">Authorization module playground</div>
    <div>
      With this page, you can test if the guard work client- and server side correctly. <br>
      Everything is associated to <strong>{{ PROVIDER }}</strong> provider.
    </div>

    <div class="flex gap-2.5 w-full">
      <AntFormGroup class="w-1/2">
        <AntFormGroupLabel>Test guard client side</AntFormGroupLabel>

        <AntField label="Is logged in?">
          <AntTag :color-type="guard.isLoggedIn() ? ColorType.success : ColorType.danger">
            {{ guard.isLoggedIn() }}
          </AntTag>
        </AntField>

        <AntField :label="`Has permission to do ${PermissionId.CAN_READ_SECRET_DATA} on ${PROVIDER} provider`">
          <AntTag
            :color-type="guard.hasPermissionTo(PermissionId.CAN_READ_SECRET_DATA, PROVIDER) ? ColorType.success : ColorType.danger"
          >
            {{ guard.hasPermissionTo(PermissionId.CAN_READ_SECRET_DATA, PROVIDER) }}
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
              :color-type="statusCode === 200 ? ColorType.success : ColorType.danger"
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
