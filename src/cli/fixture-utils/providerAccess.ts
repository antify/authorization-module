import {type ProviderAccess} from '../../runtime/server/datasources/providerAccess';
import mongoose from 'mongoose';

export const generateProviderAccesses = (
	count: number = 100,
	data: Partial<ProviderAccess> & Required<Pick<ProviderAccess, 'providerId'>>
): ProviderAccess[] => {
	return Array.from({length: count}, () => ({
		_id: new mongoose.Types.ObjectId().toString(),
		tenantId: null,
		isBanned: false,
		roles: [],
		...data
	}));
}
