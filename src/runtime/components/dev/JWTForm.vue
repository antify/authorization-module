<script lang='ts' setup>
import type {JsonWebToken, JsonWebTokenApp} from '../../types';
import AppBox from './AppBox.vue';
import {format, getUnixTime} from 'date-fns';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {ref, computed, watch, onMounted} from 'vue';
import {useGuard, useFetch, useUiClient} from '#imports';

const props = withDefaults(defineProps<{
	open: boolean
	defaultToken?: Partial<JsonWebToken>
}>(), {
	defaultToken: () => ({})
});
const emit = defineEmits(['update:open']);
const guard = useGuard();
const token = ref<JsonWebToken | null>(null);

const {status, execute} = useFetch(
	'/api/authorization-module/dev/jwt-form/create-jwt',
	{
		method: 'POST',
		body: token,
		immediate: false,
		watch: false
	}
);
const {
	status: statusGetAppData,
	data: appData
} = useFetch('/api/authorization-module/dev/jwt-form/app-data', {
	method: 'get'
});
const allPermissions = computed(() => {
	return appData.value?.permissions || [];
});
const skeleton = useUiClient().utils.createSkeleton(statusGetAppData);
const _open = computed({
	get() {
		return props.open;
	},
	set(val) {
		emit('update:open', val);
	}
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
	}
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
	}
});

async function login() {
	await execute();

	await guard.refresh();
	// The refreshCookie function takes some time to update the token value.
	setTimeout(() => setTokenValue(), 200)
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

function createToken(data: Partial<JsonWebToken> = {}): JsonWebToken {
	const _data = {
		...{
			id: '',
			isSuperAdmin: false,
			isBanned: false,
			apps: []
		},
		...data
	};

	_data.apps = _data.apps.map((app) => createApp(app));

	return _data;
}

function createApp(data: Partial<JsonWebTokenApp> = {}) {
	return {
		...{
			isAdmin: false,
			isBanned: false,
			appId: '',
			tenantId: '',
			permissions: []
		}, ...data
	};
}

function addApp(data = {}) {
	token.value.apps.push(createApp(data));
}

function removeApp(index) {
	token.value.apps.splice(index, 1);
}

watch(() => props.open, (val) => {
	if (val) {
		setTokenValue()
	}
})

onMounted(() => setTokenValue())
</script>

<template>
  <AntModal
    v-model:open="_open"
    title="Generate JWT"
    fullscreen
  >
    <div class="flex justify-between space-x-4">
      <div class="flex flex-col space-y-2 flex-grow">
        <AntTextInput
          v-model="token.id"
          label="ID"
        />

        <AntFormGroup direction="row">
          <AntSwitch
            v-model="token.isSuperAdmin"
            label="Superadmin"
          />

          <AntSwitch
            v-model="token.isBanned"
            label="Banned"
          />
        </AntFormGroup>

        <AntFormGroupLabel>Apps</AntFormGroupLabel>

        <div class="flex flex-wrap">
          <AppBox
            v-for="(app, index) of token.apps"
            :key="index"
            v-model:is-admin="app.isAdmin"
            v-model:is-banned="app.isBanned"
            v-model:app-id="app.appId"
            v-model:tenant-id="app.tenantId"
            v-model:permissions="app.permissions"
            :all-permissions="allPermissions"
            :all-apps="appData.apps || []"
            :skeleton="skeleton"
            class="mb-4 mr-4"
            @remove="() => removeApp(index)"
          />

          <div class="flex items-center mb-4">
            <AntButton
              :icon-left="faPlus"
              @click="addApp"
            />
          </div>
        </div>
      </div>

      <div class="w-2/5 flex-shrink-0 space-y-2">
        <!-- TODO:: Replace with ui module's date input field -->
        <AntField label="Issued at">
          <AntBaseInput
            v-model:value="iat"
            type="datetime-local"
          />
        </AntField>

        <AntField label="Expired at">
          <AntBaseInput
            v-model:value="exp"
            type="datetime-local"
          />
        </AntField>

        <div class="bg-neutral-100 rounded border border-neutral-300">
          <pre class="p-2">{{ token }}</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <div class="flex space-x-2.5">
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
            color-type="primary"
            filled
            :skeleton="skeleton"
            :disabled="status === 'pending'"
            @click="() => login()"
          >
            Login
          </AntButton>
        </div>
      </div>
    </template>
  </AntModal>
</template>
