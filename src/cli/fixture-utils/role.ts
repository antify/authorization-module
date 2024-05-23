import {type Role} from '../../runtime/server/datasources/schemas/role';
import mongoose from 'mongoose';

export const generateRoles = (
	count: number = 100,
	data: Partial<Role> & Required<Pick<Role, 'appId'>>
): Role[] => {
	return Array.from({length: count}, (_, index) => ({
		_id: new mongoose.Types.ObjectId().toString(),
		name: `Role ${index}`,
		isAdmin: false,
		permissions: [],
		tenantId: null,
		...data
	}));
}
