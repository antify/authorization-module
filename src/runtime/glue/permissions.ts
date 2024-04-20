import {type Permission} from '../types';

export enum PermissionId {
	// System-wide access
	CAN_BAN_AUTHORIZATION = 'CAN_BAN_AUTHORIZATION',
	CAN_UNBAN_AUTHORIZATION = 'CAN_UNBAN_AUTHORIZATION',

	// Access per tenant
	CAN_BAN_PROVIDER_ACCESS = 'CAN_BAN_PROVIDER_ACCESS',
	CAN_UNBAN_PROVIDER_ACCESS = 'CAN_UNBAN_PROVIDER_ACCESS',

	CAN_BAN_ADMIN_PROVIDER_ACCESS = 'CAN_BAN_ADMIN_PROVIDER_ACCESS',
	CAN_UNBAN_ADMIN_PROVIDER_ACCESS = 'CAN_UNBAN_ADMIN_PROVIDER_ACCESS',

	// Role management
	CAN_UPDATE_ROLE = 'CAN_UPDATE_ROLE',
	CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',
	CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',
	CAN_READ_ROLE = 'CAN_READ_ROLE',
}

export const permissions: Permission[] = [
	{
		id: PermissionId.CAN_BAN_AUTHORIZATION,
		name: 'Can ban user system-wide'
	},
	{
		id: PermissionId.CAN_UNBAN_AUTHORIZATION,
		name: 'Can unban user system-wide'
	},
	{
		id: PermissionId.CAN_BAN_PROVIDER_ACCESS,
		name: 'Can ban user'
	},
	{
		id: PermissionId.CAN_UNBAN_PROVIDER_ACCESS,
		name: 'Can unban user'
	},
	{
		id: PermissionId.CAN_BAN_ADMIN_PROVIDER_ACCESS,
		name: 'Can ban admin user'
	},
	{
		id: PermissionId.CAN_UNBAN_ADMIN_PROVIDER_ACCESS,
		name: 'Can unban admin user'
	},
	{
		id: PermissionId.CAN_UPDATE_ROLE,
		name: 'Can update role'
	},
	{
		id: PermissionId.CAN_DELETE_ROLE,
		name: 'Can delete role'
	},
	{
		id: PermissionId.CAN_CREATE_ROLE,
		name: 'Can create role'
	},
	{
		id: PermissionId.CAN_READ_ROLE,
		name: 'Can read role'
	}
];
