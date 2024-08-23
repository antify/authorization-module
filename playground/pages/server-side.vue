<script lang="ts" setup>
import {
  useGuard,
  useFetch,
  useNuxtApp,
  useUiClient,
  ref,
  computed
} from '#imports';
import {Grouped} from '#ui-module';

const guard = useGuard();
const APP = 'core';
const {$uiModule} = useNuxtApp();
const {
  data: users,
  pending: pendingGetUsers
} = useFetch('/api/server-side/users', {
  onResponse({response}) {
    if (response.status === 200) {
      selectedUserId.value = response._data[0]._id;
    }
  }
});
const selectedUserId = ref<string | null>(null);
const userOptions = computed(() => {
  return (users.value || []).map((user) => ({
    value: user._id,
    label: user.name
  }));
});
const {
  execute,
  status: loginStatus,
} = useFetch('/api/server-side/login', {
  body: {
    userId: selectedUserId
  },
  method: 'post',
  immediate: false,
  watch: false,
  onResponse({response}) {
    if (response.status === 200) {
      $uiModule.toaster.toastSuccess('Logged in successfully');

      // Give all watchers, which have an eye on the cookie, the chance to react
      guard.refresh();
    }
  }
});
const skeleton = useUiClient().utils.createSkeleton(pendingGetUsers);
</script>

<template>
  <div class="flex flex-col	gap-5 p-2.5 bg-white h-full overflow-y-auto">
    <div class="text-3xl">Server side playground</div>
    <div>
      Test logging on server side by specific user. <br>
      It also demonstrates how to implement an
      <pre class="inline bg-neutral-200 text-neutral-200-font rounded p-0.5">Authorization</pre>
      in a project.
    </div>

    <div class="w-1/3">
      <AntInputLabel
        label="Login as user"
        :skeleton="skeleton"
      >
        <div class="flex">
          <AntSelect
            v-model="selectedUserId"
            placeholder="User"
            :options="userOptions"
            :grouped="Grouped.left"
            :skeleton="skeleton"
          />
          <AntActionButton
            :grouped="Grouped.right"
            :disabled="!selectedUserId || loginStatus === 'pending'"
            :skeleton="skeleton"
            @click="() => execute()"
          >
            Login
          </AntActionButton>
        </div>
      </AntInputLabel>
    </div>
  </div>
</template>
