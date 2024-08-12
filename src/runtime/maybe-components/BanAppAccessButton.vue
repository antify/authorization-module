<script lang="ts" setup>
// TODO:: Make it way more extendable form outside. Like renaming all labels and contents in the dialogs.
import {
  ref,
  computed,
  useFetch,
  useGuard,
  showError,
  useNuxtApp,
  useAuthResponseErrorHandler,
} from '#imports';
import type {ChangeBanStatusRequestBody, AppAccess} from '../glue/components/ban-app-access-button/types';
import {PermissionId} from '../glue/permissions';
import {State} from '#ui-module';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: AppAccess,
  authorizationId: string | null,
  skeleton?: boolean,
  disabled?: boolean
}>();
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: AppAccess) => emit('update:modelValue', value)
});
const isBanDialogOpen = ref(false);
const isUnbanDialogOpen = ref(false);
const {$uiModule} = useNuxtApp();
const guard = useGuard();
const body = computed<ChangeBanStatusRequestBody>(() => ({
  appAccessId: _modelValue.value._id,
  authorizationId: props.authorizationId,
  action: _modelValue.value.isBanned ? 'unban' : 'ban'
}));
const {
  status,
  execute
} = useFetch(() => '/api/authorization-module/components/ban-app-access-button/change-ban-status', {
  method: 'post',
  watch: false,
  immediate: false,
  body,
  onResponse({response}) {
    useAuthResponseErrorHandler(response);

    if (response.status === 200) {
      if (response._data.notFound) {
        return $uiModule.toaster.toastError('User not found. Maybe he got already deleted.');
      }
      if (body.value.action === 'ban') {
        $uiModule.toaster.toastSuccess('User has been banned');
      } else {
        $uiModule.toaster.toastSuccess('User has been unbanned');
      }

      _modelValue.value.isBanned = response._data.isBanned;
    }

    if (response.status === 500) {
      showError(response._data);
    }
  }
});

function executeChangeBanStatus(action: 'ban' | 'unban') {
  body.value.action = action;
  execute();
}

const isAppAccessAnAdmin = computed(() => _modelValue.value.roles.some(role => role.isAdmin));
const hasPermission = computed(() => {
  if (_modelValue.value.appId === null) {
    return false;
  }

  // Do not allow, ban or unban himself
  if (props.authorizationId === guard.token.value?.id) {
    return false;
  }

  // Make sure, if the current app access is an admin, that the user has the permission to ban or unban an admin
  if (isAppAccessAnAdmin.value) {
    return _modelValue.value.isBanned ?
      guard.hasPermissionTo(PermissionId.CAN_UNBAN_ADMIN_APP_ACCESS, _modelValue.value.appId, _modelValue.value.tenantId) :
      guard.hasPermissionTo(PermissionId.CAN_BAN_ADMIN_APP_ACCESS, _modelValue.value.appId, _modelValue.value.tenantId);
  }

  return _modelValue.value.isBanned ?
    guard.hasPermissionTo(PermissionId.CAN_UNBAN_APP_ACCESS, _modelValue.value.appId, _modelValue.value.tenantId) :
    guard.hasPermissionTo(PermissionId.CAN_BAN_APP_ACCESS, _modelValue.value.appId, _modelValue.value.tenantId);
});
</script>

<template>
  <AntField
    label="Ban"
    description="Ban the user from this application. This will prevent the user from logging in."
    :skeleton="props.skeleton"
  >
    <AntActionButton
      :disabled="status === 'pending' || disabled"
      :skeleton="props.skeleton"
      :has-permission="hasPermission"
      :filled="false"
      @click="() => !_modelValue.isBanned ? isBanDialogOpen = true : isUnbanDialogOpen = true"
    >
      <template v-if="!_modelValue.isBanned">
        Ban user
      </template>

      <template v-else>
        Unban user
      </template>

      <template #invalidPermissionTooltipContent>
        <template v-if="authorizationId === guard.token.value?.id">
          You can not
          <template v-if="!_modelValue.isBanned">ban</template>
          <template v-else>unban</template>
          yourself
        </template>

        <template v-else-if="isAppAccessAnAdmin">
          This user is an admin. You have no permission to
          <template v-if="!_modelValue.isBanned">ban</template>
          <template v-else>unban</template>
          admin users
        </template>

        <template v-else>
          You have no permission to
          <template v-if="!_modelValue.isBanned">ban</template>
          <template v-else>unban</template>
          users
        </template>
      </template>
    </AntActionButton>

    <AntDialog
      v-model:open="isBanDialogOpen"
      title="Ban user"
      confirm-text="Ban user"
      :state="State.danger"
      @confirm="() => executeChangeBanStatus('ban')"
    >
      Are you sure you want to ban this user?<br>
      By banning this user, the user will not be able to log in anymore.
    </AntDialog>

    <AntDialog
      v-model:open="isUnbanDialogOpen"
      title="Unban user"
      confirm-text="Unban user"
      :state="State.warning"
      @confirm="() => executeChangeBanStatus('unban')"
    >
      Are you sure you want to unban this user?<br>
      By Unbanning this user, the user will be able to log in.
    </AntDialog>
  </AntField>
</template>
