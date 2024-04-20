import {type JsonWebToken} from '../../../../types';
import {useAuth} from '../../../auth';
import {
	setCookie,
	defineEventHandler,
	useRuntimeConfig,
	readBody
} from '#imports';

export default defineEventHandler(async (event) => {
	// TODO:: only call in dev mode!
	const {tokenCookieName, jwtSecret} = useRuntimeConfig().authorizationModule;
	const data = await readBody<JsonWebToken>(event);

	setCookie(
		event,
		tokenCookieName,
		await useAuth().signToken(data, jwtSecret, data.exp || '2h', data.iat)
	);

	return {};
});
