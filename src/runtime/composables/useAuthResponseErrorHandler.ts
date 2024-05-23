import {type FetchResponse} from 'ofetch';
import {
	showError,
	useRouter,
	useNuxtApp,
	useAppContext,
	appHandlerFactory
} from '#imports';

export const useAuthResponseErrorHandler = (response: FetchResponse<never>) => {
	const {appId, tenantId} = useAppContext().context.value; // TODO:: Graph from plugin
	const appHandler = appHandlerFactory(appId, tenantId);
	const {$uiModule} = useNuxtApp();
	const router = useRouter();

	if (response.status === 401) {
		if (appHandler?.loginPageRoute) {
			return router.push(appHandler?.loginPageRoute);
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
