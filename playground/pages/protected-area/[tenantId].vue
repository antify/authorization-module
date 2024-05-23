<script lang="ts" setup>
import {definePageMeta, useRouteGuard} from '#imports';
import {PermissionId} from '~/glue/permissions';

definePageMeta({
	middleware: [
		function (to) {
			return useRouteGuard({
				appId: 'tenant',
				tenantId: to.params.tenantId as string
			}, PermissionId.CAN_READ_SECRET_DATA);
		}
	]
});
</script>

<template>
  <div class="flex flex-col	gap-5 p-2.5 bg-white h-full">
    <div class="text-3xl">Protected area for tenant app</div>

    <div>
      This page should only be visible if a valid token is there. <br>
      Otherwise the auth middleware should handle this case.
    </div>
  </div>
</template>
