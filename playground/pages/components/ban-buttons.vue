<script lang="ts" setup>
import {
  useFetch,
  showError,
  useUiClient,
  computed,
  ref,
  watch
} from '#imports';
import {type AppAccess, type Authorization} from '#authorization-module';

const {
  data: users,
  pending: pendingGetUsers
} = useFetch('/api/pages/components/ban-buttons/users', {
  method: 'get',
  watch: false,
  onResponse({response}) {
    if (response.status === 500) {
      return showError(response._data);
    }

    if (response.status === 200) {
      selectedUserId.value = response._data[0]._id;
      selectedAppAccessId.value = response._data[0].authorization.appAccesses[0]?._id || null;
      authorization.value = response._data[0].authorization;
      appAccess.value = response._data[0].authorization.appAccesses[0] || null;
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
const authorization = ref<Authorization>({
  _id: null,
  isBanned: null,
  isSuperAdmin: null
});
const skeleton = useUiClient().utils.createSkeleton(pendingGetUsers);
const selectedAppAccessId = ref<string | null>(null);
const appAccess = ref<AppAccess>({
  _id: null,
  isBanned: null,
  appId: null,
  tenantId: null
});
const appAccessOptions = computed(() => {
  return (users.value?.find((user) => user._id === selectedUserId.value)?.authorization.appAccesses || [])
    .map((appAccess) => ({
      value: appAccess._id,
      label: `${appAccess.appId} - ${appAccess.tenantId}`
    }));
});

watch(selectedUserId, (val) => {
  const user = users.value?.find((_user) => _user._id === val);

  if (user) {
    authorization.value = user.authorization;
    selectedAppAccessId.value = user.authorization.appAccesses[0]?._id || null;
  }
});
watch(selectedAppAccessId, (val) => {
  const _appAccess = users.value?.find((_user) => _user._id === selectedUserId.value)
    ?.authorization.appAccesses.find((item) => item._id === val);

  if (_appAccess) {
    appAccess.value = _appAccess;
  }
});
</script>

<template>
  <div class="flex">
    <AntFormGroup class="w-1/4 p-2.5">
      <AntFormGroupLabel>Testdata</AntFormGroupLabel>

      <AntSelect
        v-model="selectedUserId"
        label="User to ban"
        description="List of users to select from. The selected user will be banned."
        placeholder="User"
        :options="userOptions"
        :skeleton="skeleton"
      />

      <AntSelect
        v-model="selectedAppAccessId"
        label="App access to ban"
        description="List of app accesses of the above selected user. The selected app access will be banned."
        placeholder="App access"
        :options="appAccessOptions"
        :skeleton="skeleton"
      />
    </AntFormGroup>

    <div class="w-px bg-neutral-300 min-h-screen" />

    <AntFormGroup class="flex-grow p-2.5">
      <AntFormGroup>
        <AntFormGroupLabel>AuthorizationModuleBanAuthorizationButton example</AntFormGroupLabel>

        <AuthorizationModuleBanAuthorizationButton
          v-model="authorization"
          :skeleton="skeleton"
          :disabled="!authorization"
        />
      </AntFormGroup>

      <div class="h-px bg-neutral-300 w-full" />

      <AntFormGroup>
        <AntFormGroupLabel>AuthorizationModuleBanAppAccessButton example</AntFormGroupLabel>

        <AuthorizationModuleBanAppAccessButton
          v-model="appAccess"
          :authorization-id="authorization._id"
          :skeleton="skeleton"
          :disabled="selectedAppAccessId === null"
        />
      </AntFormGroup>
    </AntFormGroup>
  </div>
</template>
