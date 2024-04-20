import {
	useFetch,
	useNuxtApp,
	showError,
	useUiClient
} from '#imports';
import {defineStore} from 'pinia';

function useRoleFetch(providerId: string, tenantId?: string) {
	const uiClient = useUiClient();
	const nuxtApp = useNuxtApp();
	const {$databaseModule} = nuxtApp;

	const {
		data,
		execute,
		pending
	} = useFetch(
		'/api/authorization-module/stores/role/roles',
		{
			key: `role-${providerId}-${tenantId}`,
			watch: false,
			immediate: false,
			headers: {
				Accept: 'application/json',
				...$databaseModule.getContextHeaders(providerId, tenantId)
			},
			onResponse({response}) {
				// TODO:: remove if https://github.com/antify/ui-module/issues/45 is implemented
				if (response.status === 500) {
					showError(response._data)
				}
			}
		}
	)

	return {
		execute,
		data,
		pending,
		skeleton: uiClient.utils.createSkeleton(pending),
	}
}

export const useRoleStore = defineStore('authorization-module-role', () => {
	const state: Record<string, never> = {}

	return {
		getFetch: (providerId: string, tenantId?: string) => {
			if (!state[`${providerId}-${tenantId}`]) {
				state[`${providerId}-${tenantId}`] = useRoleFetch(providerId, tenantId)
			}

			return state[`${providerId}-${tenantId}`]
		},
		deleteFetch: (providerId: string, tenantId?: string) => {
			delete state[`${providerId}-${tenantId}`]
		}
	}
});
