import {type Permission} from '#authorization-module';
import {permissions as _permissions} from '../../src/runtime/glue/permissions';

export enum PermissionId {
	CAN_READ_SECRET_DATA = 'CAN_READ_SECRET_DATA',
}

export const permissions: Permission[] = [
	{
		id: PermissionId.CAN_READ_SECRET_DATA,
		name: 'Can read secret data in playground'
	},
	..._permissions
];
