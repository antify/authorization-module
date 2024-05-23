import {
	useFetch,
	showError,
	useUiClient
} from '#imports';
import {defineStore} from 'pinia';

export function useRoleFetch(appId: string, tenantId: string | null) {
	const {
		data,
		execute,
		pending
	} = useFetch(
		'/api/authorization-module/stores/role/roles',
		{
			query: {
				appId,
				tenantId
			},
			watch: false,
			immediate: false,
			headers: {
				Accept: 'application/json'
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
		skeleton: useUiClient().utils.createSkeleton(pending),
	}
}

export const useRoleStore = defineStore('authorization-module-role', () => {
	const state: Record<string, never> = {}

	return {
		getFetch: (appId: string, tenantId: string | null) => {
			if (!state[`${appId}-${tenantId}`]) {
				state[`${appId}-${tenantId}`] = useRoleFetch(appId, tenantId);
			}

			return state[`${appId}-${tenantId}`];
		},
		deleteFetch: (appId: string, tenantId: string | null) => {
			delete state[`${appId}-${tenantId}`];
		}
	}
});
