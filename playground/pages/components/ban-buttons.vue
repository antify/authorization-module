<script lang="ts" setup>
import {
  useFetch,
  showError,
  useUiClient,
  computed,
  ref,
  watch, useGuard,
} from '#imports';
import type {
  Authorization,
} from '../../../src/runtime/types';
import {
  PermissionId,
} from '#shared/permissions';

const guard = useGuard();
const canBan = computed(() => guard.hasPermissionTo(PermissionId.CAN_BAN_AUTHORIZATION));
const canUnban = computed(() => guard.hasPermissionTo(PermissionId.CAN_UNBAN_AUTHORIZATION));

const {
  data: users,
  pending: pendingGetUsers,
} = useFetch('/api/pages/components/ban-buttons/users', {
  method: 'get',
  watch: false,
  onResponse({
    response,
  }) {
    if (response.status === 500) {
      return showError(response._data);
    }

    if (response.status === 200) {
      selectedUserId.value = response._data[0]._id;
      authorization.value = response._data[0].authorization;
    }
  },
});
const selectedUserId = ref<string | null>(null);
const userOptions = computed(() => {
  return (users.value || []).map((user) => ({
    value: user._id,
    label: user.name,
  }));
});
const authorization = ref<Authorization>({
  _id: null,
  isBanned: null,
  isSuperAdmin: null,
});
const skeleton = useUiClient().utils.createSkeleton(pendingGetUsers);

watch(selectedUserId, (val) => {
  const user = users.value?.find((_user) => _user._id === val);

  if (user) {
    authorization.value = user.authorization;
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
    </AntFormGroup>

    <div class="w-px bg-neutral-300 min-h-screen" />

    <AntFormGroup class="flex-grow p-2.5">
      <AntFormGroup>
        <AntFormGroupLabel>AuthorizationModuleBanAuthorizationButton example</AntFormGroupLabel>

        <AuthorizationModuleBanAuthorizationButton
          v-model="authorization"
          :skeleton="skeleton"
          :disabled="!authorization"
          :can-ban="canBan"
          :can-unban="canUnban"
        />
      </AntFormGroup>
    </AntFormGroup>
  </div>
</template>
