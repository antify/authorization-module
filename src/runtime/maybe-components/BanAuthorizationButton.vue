<script lang="ts" setup>
import {
  ref, computed,
} from 'vue';
import {
  useFetch,
  useNuxtApp,
  showError,
  useGuard,
  useAuthResponseErrorHandler,
} from '#imports';
import type {
  Authorization,
  ChangeBanStatusRequestBody,
} from '~/src/runtime/glue/maybe-components/ban-authorization-button/types';
import {
  PermissionId,
} from '../permissions';
import {
  State,
} from '#ui-module';

const emit = defineEmits([
  'update:modelValue',
]);
const props = withDefaults(defineProps<{
  modelValue: Authorization;
  skeleton?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  entityNotFoundToastMessage?: string;
  entityHasBeenBannedToastMessage?: string;
  entityUnbannedToastMessage?: string;
  areYouSureToBanDialogMessage?: string;
  areYouSureToUnbanDialogMessage?: string;
  entityName?: string;
}>(), {
  label: 'Ban',
  description: 'Ban the user from this application. This will prevent the user from logging in.',
  entityNotFoundToastMessage: 'User not found. Maybe he got already deleted.',
  entityHasBeenBannedToastMessage: 'User has been banned',
  entityUnbannedToastMessage: 'User has been unbanned',
  areYouSureToBanDialogMessage: 'Are you sure you want to ban this user?<br>By banning this user, the user will not be able to log in anymore.',
  areYouSureToUnbanDialogMessage: 'Are you sure you want to unban this user?<br>By Unbanning this user, the user will be able to log in.',
  entityName: 'user',
});
const _modelValue = computed({
  get: () => props.modelValue,
  set: (value: Authorization) => emit('update:modelValue', value),
});
const isBanDialogOpen = ref(false);
const isUnbanDialogOpen = ref(false);
const {
  $uiModule,
} = useNuxtApp();
const guard = useGuard();
const body = computed<ChangeBanStatusRequestBody>(() => ({
  authorizationId: _modelValue.value._id as string,
  action: _modelValue.value.isBanned ? 'unban' : 'ban',
}));
const {
  status,
  execute,
} = useFetch(() => '/api/authorization-module/maybe-components/ban-authorization-button/change-ban-status', {
  method: 'post',
  watch: false,
  immediate: false,
  body,
  onResponse({
    response,
  }) {
    useAuthResponseErrorHandler(response);

    if (response.status === 200) {
      if (response._data.notFound) {
        return $uiModule.toaster.toastError(props.entityNotFoundToastMessage);
      } else if (body.value.action === 'ban') {
        $uiModule.toaster.toastSuccess(props.entityHasBeenBannedToastMessage);
      } else {
        $uiModule.toaster.toastSuccess(props.entityUnbannedToastMessage);
      }

      _modelValue.value.isBanned = response._data.isBanned;
    }

    if (response.status === 500) {
      showError(response._data);
    }
  },
});

function executeChangeBanStatus(action: 'ban' | 'unban') {
  body.value.action = action;
  execute();
}

const hasPermission = computed(() => {
  if (_modelValue.value._id === null) {
    return false;
  }

  // Do not allow, ban or unban himself
  if (_modelValue.value._id === guard.token.value?.id) {
    return false;
  }

  return _modelValue.value.isBanned ?
    guard.hasPermissionTo(PermissionId.CAN_UNBAN_AUTHORIZATION) :
    guard.hasPermissionTo(PermissionId.CAN_BAN_AUTHORIZATION);
});
</script>

<template>
  <AntField
    :label="label"
    :description="description"
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
        Ban {{ entityName }}
      </template>

      <template v-else>
        Unban {{ entityName }}
      </template>

      <template #invalidPermissionTooltipContent>
        <template v-if="_modelValue._id === guard.token.value?.id">
          You can not
          <template v-if="!_modelValue.isBanned">
            ban
          </template>
          <template v-else>
            unban
          </template>
          yourself
        </template>

        <template v-else>
          You have no permission to
          <template v-if="!_modelValue.isBanned">
            ban
          </template>
          <template v-else>
            unban
          </template>
          {{ entityName }}s.
        </template>
      </template>
    </AntActionButton>

    <AntDialog
      v-model:open="isBanDialogOpen"
      :title="`Ban ${entityName}`"
      :confirm-text="`Ban ${entityName}`"
      :state="State.danger"
      @confirm="() => executeChangeBanStatus('ban')"
    >
      <div v-html="areYouSureToBanDialogMessage" />
    </AntDialog>

    <AntDialog
      v-model:open="isUnbanDialogOpen"
      :title="`Unban ${entityName}`"
      :confirm-text="`Unban ${entityName}`"
      :state="State.warning"
      @confirm="() => executeChangeBanStatus('unban')"
    >
      <div v-html="areYouSureToUnbanDialogMessage" />
    </AntDialog>
  </AntField>
</template>
