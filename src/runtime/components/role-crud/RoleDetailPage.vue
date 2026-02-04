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
  TabItemState, InputState, AntTooltip,
} from '#template-module';

withDefaults(defineProps<{
  canEdit?: boolean;
  editTooltipMessage?: string;
}>(), {
  canEdit: true,
  editTooltipMessage: undefined,
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
  <AntTemplateCrudDetail>
    <template #header>
      <AntTemplateCrudDetailNav
        :tab-items="tabItems"
        :skeleton="detailStore.skeleton"
        :get-entity-name="() => `${detailStore.entity.name}`"
        :delete-button-disabled="detailStore.formDisabled"
        :show-delete-button="!routingStore.routing.isCreatePage.value"
        :can-delete="canEdit"
        :delete-tooltip-message="editTooltipMessage"
        @delete="() => deleteStore.execute(detailStore.entity._id as string)"
      />
    </template>

    <slot />

    <template #footer>
      <AntTemplateCrudDetailActions
        :skeleton="detailStore.skeleton"
        :disabled="detailStore.formDisabled"
        :can-save="canEdit"
        :save-tooltip-message="editTooltipMessage"
        :save-and-new-tooltip-message="editTooltipMessage"
        @back="() => routingStore.routing.goToListingPage()"
        @save="() => detailStore.save()"
        @save-and-new="() => detailStore.saveAndNew()"
      />
    </template>
  </AntTemplateCrudDetail>
</template>
