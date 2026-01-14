<script setup lang="ts">
import type {
  ResponsePermissionType,
} from '~/src/runtime/glue/stores/role-crud/[roleId].get';
import {
  useRoleDetailStore,
} from '../../stores/roleCrud';
import {
  roleServerSchema,
} from '../../glue/stores/role-crud';
import {
  computed, onMounted, ref, useUiClient,
} from '#imports';
import {
  Schema,
} from 'yup';

const permissionDisableTooltip = 'Admin role has all permissions. Mark this role as non-admin to select permissions manually.';
const roleDetailStore = useRoleDetailStore();
const name = useUiClient().utils.useFormField(async () => await (roleServerSchema.fields.name as Schema)
  .validate(roleDetailStore.entity.name, {
    strict: true,
    abortEarly: false,
  }));
const nameInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  roleDetailStore.forms.mainData.push(name);
});

const appsPermissionsCheckboxes = computed(() => {
  return roleDetailStore.allPermissions
    .map((item: ResponsePermissionType) => ({
      value: item.id,
      label: item.name,
    }));
});

function selectAll() {
  roleDetailStore.entity.permissions = roleDetailStore.allPermissions.map(permission => permission.id);
}

function unselectAll() {
  roleDetailStore.entity.permissions = [];
}

onMounted(() => nameInputRef.value?.focus());
</script>

<template>
  <form
    class="p-2.5"
    @submit.prevent="roleDetailStore.save"
  >
    <AntCard class="w-full">
      <AntFormGroup>
        <AntFormGroup direction="row">
          <div class="w-1/2">
            <AntTextInput
              v-model="roleDetailStore.entity.name"
              v-model:input-ref="nameInputRef"
              label="Name"
              :skeleton="roleDetailStore.skeleton"
              :disabled="roleDetailStore.formDisabled"
              :state="name.state"
              :messages="name.errors"
              @validate="name.validate"
            />
          </div>

          <AntSwitch
            v-model="roleDetailStore.entity.isAdmin"
            :skeleton="roleDetailStore.skeleton"
            label="Admin"
          />
        </AntFormGroup>

        <div>
          <AntField
            label="Permissions"
            :skeleton="roleDetailStore.skeleton"
          >
            <div class="mb-2 flex space-x-2.5">
              <AntButton
                size="sm"
                :skeleton="roleDetailStore.skeleton"
                :disabled="roleDetailStore.entity.isAdmin"
                @click="selectAll"
              >
                Alle auswählen

                <template
                  v-if="roleDetailStore.entity.isAdmin"
                  #tooltip-content
                >
                  {{ permissionDisableTooltip }}
                </template>
              </AntButton>

              <AntButton
                size="sm"
                :skeleton="roleDetailStore.skeleton"
                :disabled="roleDetailStore.entity.isAdmin"
                @click="unselectAll"
              >
                Alle abwählen

                <template
                  v-if="roleDetailStore.entity.isAdmin"
                  #tooltip-content
                >
                  {{ permissionDisableTooltip }}
                </template>
              </AntButton>
            </div>
          </AntField>

          <AntCheckboxGroup
            v-model="roleDetailStore.entity.permissions"
            :skeleton="roleDetailStore.skeleton"
            :checkboxes="appsPermissionsCheckboxes"
            :disabled="roleDetailStore.entity.isAdmin"
          />
        </div>
      </AntFormGroup>
    </AntCard>
  </form>
</template>
