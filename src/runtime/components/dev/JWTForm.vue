<script lang='ts' setup>
import type {
  JsonWebToken, Permission,
} from '../../types';
import {
  format, getUnixTime,
} from 'date-fns';
import {
  useGuard,
  useFetch,
  ref,
  computed,
  watch,
  onMounted,
} from '#imports';
import {
  AntDateInputTypes,
} from '#ui-module';

const props = withDefaults(defineProps<{
  open: boolean;
  defaultToken?: Partial<JsonWebToken>;
  unknownGroupLabel?: string;
}>(), {
  defaultToken: () => ({}),
  unknownGroupLabel: 'Others',
});
const emit = defineEmits([
  'update:open',
]);
const guard = useGuard();
const token = ref<JsonWebToken>(createToken());

const {
  status, execute,
} = useFetch(
  '/api/authorization-module/dev/jwt-form/create-jwt',
  {
    method: 'POST',
    body: token,
    immediate: false,
    watch: false,
  },
);
const {
  status: statusGetAppData,
  data: appData,
} = useFetch('/api/authorization-module/dev/jwt-form/app-data', {
  method: 'get',
});
const allPermissions = computed(() => {
  return appData.value?.permissions || [];
});
const skeleton = computed(() => statusGetAppData.value === 'idle' || statusGetAppData.value === 'pending');
const _open = computed({
  get() {
    return props.open;
  },
  set(val) {
    emit('update:open', val);
  },
});
const iat = computed({
  get() {
    if (!token.value.iat) {
      return null;
    }

    // TODO:: to iso string should do the same job?
    return format(new Date(token.value.iat * 1000), 'yyyy-MM-dd\'T\'HH:mm:ss');
  },
  set(val) {
    token.value.iat = getUnixTime(new Date(val));
  },
});
const exp = computed({
  get() {
    if (!token.value.exp) {
      return null;
    }

    // TODO:: to iso string should do the same job?
    return format(new Date(token.value.exp * 1000), 'yyyy-MM-dd\'T\'HH:mm:ss');
  },
  set(val) {
    token.value.exp = getUnixTime(new Date(val));
  },
});
const permissions = computed(() => {
  return allPermissions.value
    .map((item: Permission) => ({
      value: item.id,
      label: item.name,
    }));
});

async function login() {
  await execute();

  await guard.refresh();
  // The refreshCookie function takes some time to update the token value.
  setTimeout(() => setTokenValue(), 200);
}

function logout() {
  guard.logout();
  token.value = createToken();
}

function setTokenValue() {
  token.value = guard.token.value ? JSON.parse(JSON.stringify(guard.token.value)) : createToken();
}

function setDefaultData() {
  token.value = createToken(props.defaultToken);
}

function selectAll() {
  token.value.permissions = allPermissions.value.map((permission) => permission.id);
}

function unselectAll() {
  token.value.permissions = [];
}

function createToken(data: Partial<JsonWebToken> = {}): JsonWebToken {
  return {
    ...{
      id: '',
      tenantId: null,
      isBanned: false,
      isAdmin: false,
      permissions: [],
    },
    ...data,
  };
}

watch(() => props.open, (val) => {
  if (val) {
    setTokenValue();
  }
});

onMounted(() => setTokenValue());

const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {};

  allPermissions.value.forEach((permission) => {
    const groupName = permission.group || props.unknownGroupLabel;

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(permission);
  });

  return groups;
});

</script>

<template>
  <AntModal
    v-if="_open"
    title="Generate JWT"
    fullscreen
  >
    <div class="flex justify-between space-x-4 p-2.5">
      <AntFormGroup class="flex-grow">
        <AntFormGroup direction="row">
          <AntTextInput
            v-model="token.id"
            label="Authorization ID"
          />

          <!-- TODO:: Make select field with all tenants as option for faster tenant change -->
          <AntTextInput
            v-model="token.tenantId"
            :skeleton="skeleton"
            label="Tenant ID"
          />
        </AntFormGroup>

        <AntFormGroup direction="row">
          <AntSwitch
            v-model="token.isAdmin"
            label="Admin"
          />

          <AntSwitch
            v-model="token.isBanned"
            label="Banned"
          />
        </AntFormGroup>

        <div class="flex flex-wrap">
          <AntField
            label="Permissions"
            :skeleton="skeleton"
          >
            <div class="mb-2 flex space-x-2.5">
              <AntButton
                size="sm"
                :skeleton="skeleton"
                @click="selectAll"
              >
                Select all
              </AntButton>

              <AntButton
                size="sm"
                :skeleton="skeleton"
                @click="unselectAll"
              >
                Unselect all
              </AntButton>
            </div>
          </AntField>

          <div class="w-full space-y-6 mt-2">
            <div
              v-for="(permissionsInGroup, groupName, index) in groupedPermissions"
              :key="groupName"
            >
              <hr
                v-if="index > 0"
                class="mb-4 border-neutral-200"
              >

              <h4 class="mb-2 uppercase">
                {{ groupName }}
              </h4>

              <AntCheckboxGroup
                v-model="token.permissions"
                :skeleton="skeleton"
                :checkboxes="permissionsInGroup.map(i => ({ value: i.id, label: i.name }))"
              />
            </div>
          </div>
        </div>
      </AntFormGroup>

      <AntFormGroup class="w-2/5 flex-shrink-0">
        <AntField label="Issued at">
          <AntDateInput
            v-model="iat"
            :type="AntDateInputTypes.datetimeLocal"
          />
        </AntField>

        <AntField label="Expired at">
          <AntDateInput
            v-model="exp"
            :type="AntDateInputTypes.datetimeLocal"
          />
        </AntField>

        <div class="bg-neutral-100 rounded border border-neutral-300">
          <pre class="p-2">{{ token }}</pre>
        </div>
      </AntFormGroup>
    </div>

    <template #footer>
      <AntFormGroup
        direction="row"
        class="justify-end"
      >
        <AntButton
          :skeleton="skeleton"
          @click="() => logout()"
        >
          Logout
        </AntButton>

        <AntButton
          :skeleton="skeleton"
          @click="setDefaultData"
        >
          Set default data
        </AntButton>

        <AntButton
          state="primary"
          filled
          :skeleton="skeleton"
          :disabled="status === 'pending'"
          @click="() => login()"
        >
          Login
        </AntButton>
      </AntFormGroup>
    </template>
  </AntModal>
</template>
