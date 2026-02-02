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
  computed, onMounted, ref, useUiClient, watch,
} from '#imports';
import {
  Schema,
} from 'yup';

const props = withDefaults(defineProps<{
  unknownGroupLabel?: string;
  dependencyTooltipMessage?: string;
}>(), {
  unknownGroupLabel: 'Others',
  dependencyTooltipMessage: 'Um alle Rechte auswählen zu können, müssen Sie folgende Rechte aktivieren:',
});

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

function selectAll() {
  roleDetailStore.entity.permissions = roleDetailStore.allPermissions.map(permission => permission.id);
}

function unselectAll() {
  roleDetailStore.entity.permissions = [];
}

const groupedPermissions = computed(() => {
  const groups: Record<string, ResponsePermissionType[]> = {};

  roleDetailStore.allPermissions.forEach((permission: ResponsePermissionType) => {
    const groupName = permission.group || props.unknownGroupLabel;

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(permission);
  });

  return groups;
});

function isGroupSelected(permissionsInGroup: ResponsePermissionType[]): boolean {
  if (permissionsInGroup.length === 0) {
    return false;
  }

  return permissionsInGroup.every(p => roleDetailStore.entity.permissions.includes(p.id));
}

function toggleGroup(permissionsInGroup: ResponsePermissionType[]) {
  const groupIds = permissionsInGroup.map(p => p.id);
  const currentlySelected = [
    ...roleDetailStore.entity.permissions,
  ];

  if (isGroupSelected(permissionsInGroup)) {
    roleDetailStore.entity.permissions = currentlySelected.filter(id => !groupIds.includes(id));
  } else {
    const newSelection = [
      ...currentlySelected,
    ];
    groupIds.forEach(id => {
      if (!newSelection.includes(id)) {
        newSelection.push(id);
      }
    });
    roleDetailStore.entity.permissions = newSelection;
  }
}

function areDependenciesSatisfied(permission: ResponsePermissionType): boolean {
  if (!permission.dependsOn) return true;

  const deps = Array.isArray(permission.dependsOn)
    ? permission.dependsOn
    : [
      permission.dependsOn,
    ];

  return deps.every(depId => roleDetailStore.entity.permissions.includes(depId));
}

function getMissingDependencies(permission: ResponsePermissionType): string[] {
  if (!permission.dependsOn) return [];

  const deps = Array.isArray(permission.dependsOn) ? permission.dependsOn : [
    permission.dependsOn,
  ];

  return deps
    .filter(depId => !roleDetailStore.entity.permissions.includes(depId))
    .map(depId => {
      const depLabel = roleDetailStore.allPermissions.find(p => p.id === depId);

      return depLabel ? depLabel.name : depId;
    });
}

watch(() => roleDetailStore.entity.permissions, (newPermissions) => {
  let permissionsToUpdate = [
    ...newPermissions,
  ];
  let changed = true;
  let totalChanged = false;

  while (changed) {
    changed = false;
    const countBefore = permissionsToUpdate.length;

    permissionsToUpdate = permissionsToUpdate.filter(id => {
      const perm = roleDetailStore.allPermissions.find(p => p.id === id);
      if (!perm || !perm.dependsOn) return true;

      const deps = Array.isArray(perm.dependsOn) ? perm.dependsOn : [
        perm.dependsOn,
      ];

      return deps.every(depId => permissionsToUpdate.includes(depId));
    });

    if (permissionsToUpdate.length !== countBefore) {
      changed = true;
      totalChanged = true;
    }
  }

  if (totalChanged) {
    roleDetailStore.entity.permissions = permissionsToUpdate;
  }
}, {
  deep: true,
});

watch(nameInputRef, (val) => {
  if (!val) {
    return;
  }

  val.focus();
});
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

          <div class="mt-2 mb-2">
            <div
              v-for="(permissionsInGroup, groupName, index) in groupedPermissions"
              :key="groupName"
            >
              <hr
                v-if="index > 0"
                class="my-4 border-gray-200"
              >

              <div class="mb-4">
                <AntCheckbox
                  :model-value="isGroupSelected(permissionsInGroup)"
                  :disabled="roleDetailStore.entity.isAdmin"
                  :skeleton="roleDetailStore.skeleton"
                  active-color-class="text-primary-500"
                  @update:model-value="toggleGroup(permissionsInGroup)"
                >
                  <span class="mb-2 uppercase">
                    {{ groupName }}
                  </span>
                </AntCheckbox>
              </div>
              <div class="ml-6">
                <AntTooltip
                  :disabled="
                    roleDetailStore.entity.isAdmin ||
                      permissionsInGroup.every(p => areDependenciesSatisfied(p))
                  "
                >
                  <AntCheckboxGroup
                    v-model="roleDetailStore.entity.permissions"
                    :skeleton="roleDetailStore.skeleton"
                    :disabled="roleDetailStore.entity.isAdmin"
                    :checkboxes="permissionsInGroup.map(item => {
                      const missingDeps = getMissingDependencies(item);
                      const isDisabled = missingDeps.length > 0;

                      return {
                        value: item.id,
                        label: item.name,
                        disabled: isDisabled,
                        title: isDisabled ? `${props.dependencyTooltipMessage} ${missingDeps.join(', ')}` : ''
                      };
                    })"
                  />

                  <template #content>
                    <div>
                      {{ dependencyTooltipMessage }}
                      <ul class="mt-1 list-disc pl-4 text-sm">
                        <li
                          v-for="missingName in [
                            ...new Set(permissionsInGroup.flatMap(p => getMissingDependencies(p)))
                          ]"
                          :key="missingName"
                        >
                          {{ missingName }}
                        </li>
                      </ul>
                    </div>
                  </template>
                </AntTooltip>
              </div>
            </div>
          </div>
        </div>
      </AntFormGroup>
    </AntCard>
  </form>
</template>
