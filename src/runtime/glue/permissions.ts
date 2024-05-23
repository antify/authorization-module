export enum PermissionId {
	// System-wide access
	CAN_BAN_AUTHORIZATION = 'CAN_BAN_AUTHORIZATION',
	CAN_UNBAN_AUTHORIZATION = 'CAN_UNBAN_AUTHORIZATION',

	// Access per tenant
	CAN_BAN_APP_ACCESS = 'CAN_BAN_APP_ACCESS',
	CAN_UNBAN_APP_ACCESS = 'CAN_UNBAN_APP_ACCESS',

	CAN_BAN_ADMIN_APP_ACCESS = 'CAN_BAN_ADMIN_APP_ACCESS',
	CAN_UNBAN_ADMIN_APP_ACCESS = 'CAN_UNBAN_ADMIN_APP_ACCESS',

	// Role management
	CAN_UPDATE_ROLE = 'CAN_UPDATE_ROLE',
	CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',
	CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',
	CAN_READ_ROLE = 'CAN_READ_ROLE',
}
