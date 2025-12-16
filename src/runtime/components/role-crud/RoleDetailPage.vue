<script setup lang="ts">
import {
  computed,
  onMounted,
} from '#imports';
import {
  useRoleRoutingStore,
  useRoleDetailStore,
  useDeleteRoleStore,
} from '../../stores/roleCrud';
import {
  TabItemState, InputState, AntTooltip
} from '#ui-module';
import {
  AntCrudDetail,
  AntCrudDetailNav,
  AntCrudDetailActions,
  AntSaveButton,
  AntSaveAndNewButton
} from '@antify/default-template';

withDefaults(defineProps<{
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  createTooltipMessage?: string;
  updateTooltipMessage?: string;
  deleteTooltipMessage?: string;
}>(), {
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  createTooltipMessage: '(Berechtigungsfehler)',
  updateTooltipMessage: '(Berechtigungsfehler)',
  deleteTooltipMessage: '(Berechtigungsfehler)',
});

const routingStore = useRoleRoutingStore();
const detailStore = useRoleDetailStore();
const deleteStore = useDeleteRoleStore();
const roleId = routingStore.routing.getEntityId();
const tabItems = computed(() => ([
  {
    // TODO:: remove id if @antify/ui-module #11 is solved
    id: 'main-data',
    // TODO:: translate
    label: 'Stammdaten',
    to: routingStore.routing.getDetailRoute(roleId),
    state: detailStore.forms.mainData.some(field => field.errors.length > 0) ? TabItemState.danger : TabItemState.base,
  },
]));

onMounted(() => {
  detailStore.resetForms();

  if (routingStore.routing.isCreatePage.value) {
    detailStore.resetData();
  } else if (roleId !== detailStore.entity._id) {
    detailStore.resetData();
    detailStore.fetchEntity();
  }
});
</script>

<template>
  <AntCrudDetail>
    <template #header>
      <AntCrudDetailNav
        :tab-items="tabItems"
        :skeleton="detailStore.skeleton"
        :get-entity-name="() => `${detailStore.entity.name}`"
        :delete-button-disabled="detailStore.formDisabled"
        :show-delete-button="!routingStore.routing.isCreatePage.value"
        :can-delete="canDelete"
        @delete="() => deleteStore.execute(detailStore.entity._id as string)"
      />
    </template>

    <slot />

    <template #footer>

      <AntCrudDetailActions
        :skeleton="detailStore.skeleton"
        :disabled="detailStore.formDisabled"
        :can-save="canUpdate || canCreate"
        @back="() => routingStore.routing.goToListingPage()"
        @save="() => detailStore.save()"
        @save-and-new="() => detailStore.saveAndNew()"
      >
        <template #buttons-right>
          <AntTooltip :state="InputState.base">
            <AntSaveAndNewButton
              :skeleton="detailStore.skeleton"
              :disabled="detailStore.formDisabled || !(canUpdate || canCreate)"
              :can-save="canUpdate || canCreate"
              @click="() => detailStore.saveAndNew()"
            />
            <template
              v-if="!(canUpdate || canCreate)"
              #content
            >
              <div>
                {{ !canCreate ? createTooltipMessage : updateTooltipMessage }}
              </div>
            </template>
          </AntTooltip>

          <AntTooltip :state="InputState.base">
            <AntSaveButton
              :skeleton="detailStore.skeleton"
              :disabled="detailStore.formDisabled || !(canUpdate || canCreate)"
              :can-save="canUpdate || canCreate"
              @click="() => detailStore.save()"
            />
            <template
              v-if="!(canUpdate || canCreate)"
              #content
            >
              <div>
                {{ !canCreate ? createTooltipMessage : updateTooltipMessage }}
              </div>
            </template>
          </AntTooltip>
        </template>
        </AntCrudDetailActions>
    </template>
  </AntCrudDetail>
</template>
