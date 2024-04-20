<script lang="ts" setup>
import {definePageMeta, useRouteGuard} from '#imports';

definePageMeta({
	middleware: [
		function () {
			return useRouteGuard('core');
		}
	]
});
</script>

<template>
  <div class="flex flex-col	gap-5 p-2.5 bg-white h-full">
    <div class="text-3xl">Protected area for core provider</div>

    <div>
      This page should only be visible if a valid token is there. <br>
      Otherwise the auth middleware should handle this case.
    </div>
  </div>
</template>
