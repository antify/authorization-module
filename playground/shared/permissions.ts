import type {
  Permission,
} from '#authorization-module';

export enum PermissionId {
  CAN_READ_SECRET_DATA = 'CAN_READ_SECRET_DATA',

  // Ban & unban
  CAN_BAN_AUTHORIZATION = 'CAN_BAN_AUTHORIZATION',
  CAN_UNBAN_AUTHORIZATION = 'CAN_UNBAN_AUTHORIZATION',

  // Role management
  CAN_UPDATE_ROLE = 'CAN_UPDATE_ROLE',
  CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',
  CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',
  CAN_READ_ROLE = 'CAN_READ_ROLE',
}

export const permissions: Permission[] = [
  {
    id: PermissionId.CAN_READ_SECRET_DATA,
    name: 'Can read another secret data',
    group: 'General',
  },

  // === BAN & UNBAN ===
  {
    id: PermissionId.CAN_BAN_AUTHORIZATION,
    name: 'Can ban user accounts',
    group: 'User Management',
  },
  {
    id: PermissionId.CAN_UNBAN_AUTHORIZATION,
    name: 'Can unban user accounts',
    group: 'User Management',
  },

  // === ROLE MANAGEMENT ===
  {
    id: PermissionId.CAN_READ_ROLE,
    name: 'Can view roles',
    group: 'Role Management',
    isLeading: true,
  },
  {
    id: PermissionId.CAN_CREATE_ROLE,
    name: 'Can create new roles',
    group: 'Role Management',
  },
  {
    id: PermissionId.CAN_UPDATE_ROLE,
    name: 'Can edit roles',
    group: 'Role Management',
  },
  {
    id: PermissionId.CAN_DELETE_ROLE,
    name: 'Can delete roles',
    group: 'Role Management',
  },
];
