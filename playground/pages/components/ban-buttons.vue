<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {
	useFetch,
	useNuxtApp,
	showError,
	useUiClient
} from '#imports';
import {type Authorization} from '../../../src/runtime/glue/components/ban-authorization-button/types';
import {type ProviderAccess} from '../../../src/runtime/glue/components/ban-provider-access-button/types';

const {$databaseModule} = useNuxtApp()
const {
	data: users,
	pending: pendingGetUsers
} = useFetch('/api/pages/components/ban-buttons/users', {
	method: 'get',
	watch: false,
	headers: $databaseModule.getContextHeaders('core'),
	onResponse({response}) {
		if (response.status === 500) {
			return showError(response._data)
		}

		if (response.status === 200) {
			selectedUserId.value = response._data[0]._id
			selectedProviderAccessId.value = response._data[0].authorization.providerAccesses[0]?._id || null
			authorization.value = response._data[0].authorization
			providerAccess.value = response._data[0].authorization.providerAccesses[0] || null
		}
	}
});
const selectedUserId = ref<string | null>(null)
const userOptions = computed(() => {
	return (users.value || []).map((user) => ({
		value: user._id,
		label: user.name
	}))
});
const authorization = ref<Authorization>({
	_id: null,
	isBanned: null,
	isSuperAdmin: null
});
const skeleton = useUiClient().utils.createSkeleton(pendingGetUsers);
const selectedProviderAccessId = ref<string | null>(null)
const providerAccess = ref<ProviderAccess>({
	_id: null,
	isBanned: null,
	providerId: null,
	tenantId: null
})
const providerAccessOptions = computed(() => {
	return (users.value?.find((user) => user._id === selectedUserId.value)?.authorization.providerAccesses || [])
		.map((providerAccess) => ({
			value: providerAccess._id,
			label: `${providerAccess.providerId} - ${providerAccess.tenantId}`
		}))
})

watch(selectedUserId, (val) => {
	const user = users.value?.find((_user) => _user._id === val)

	if (user) {
		authorization.value = user.authorization
		selectedProviderAccessId.value = user.authorization.providerAccesses[0]?._id || null
	}
})
watch(selectedProviderAccessId, (val) => {
	const _providerAccess = users.value?.find((_user) => _user._id === selectedUserId.value)
		?.authorization.providerAccesses.find((item) => item._id === val)

	if (_providerAccess) {
		providerAccess.value = _providerAccess
	}
})
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
        v-model="selectedProviderAccessId"
        label="Provider access to ban"
        description="List of provider accesses of the above selected user. The selected provider access will be banned."
        placeholder="Provider access"
        :options="providerAccessOptions"
        :skeleton="skeleton"
      />
    </AntFormGroup>

    <div class="w-px bg-neutral-300 min-h-screen" />

    <AntFormGroup class="flex-grow p-2.5">
      <AntFormGroup>
        <AntFormGroupLabel>AntAuthBanAuthorizationButton example</AntFormGroupLabel>

        <AntAuthBanAuthorizationButton
          v-model="authorization"
          :skeleton="skeleton"
          :disabled="!authorization"
        />
      </AntFormGroup>

      <div class="h-px bg-neutral-300 w-full" />

      <AntFormGroup>
        <AntFormGroupLabel>AntAuthBanProviderAccessButton example</AntFormGroupLabel>

        <AntAuthBanProviderAccessButton
          v-model="providerAccess"
          :authorization-id="authorization._id"
          :skeleton="skeleton"
          :disabled="selectedProviderAccessId === null"
        />
      </AntFormGroup>
    </AntFormGroup>
  </div>
</template>
