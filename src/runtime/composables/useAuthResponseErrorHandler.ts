import {type FetchResponse} from 'ofetch';
import {
	useNuxtApp,
	useRuntimeConfig,
	showError
} from '#imports';

export const useAuthResponseErrorHandler = (response: FetchResponse<never>) => {
	const {loginPageRoute} = useRuntimeConfig().public.authorizationModule;
	const {$uiModule} = useNuxtApp();

	if (response.status === 401) {
		if (loginPageRoute) {
			return $uiModule.router.push(loginPageRoute);
		}

		return showError({
			statusCode: 401,
			statusMessage: 'Unauthorized - Configure a loginPageRoute in nuxt config \nto automatically redirect unauthorized users to login page.'
		});
	}

	if (response.status === 403) {
		// TODO:: Mai write which permission/permissions is/are missing
		return $uiModule.toaster.toastError('You are not authorized to carry out this action. \nPlease contact your administrator.');
	}
}
