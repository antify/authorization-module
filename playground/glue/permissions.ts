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
    name: 'Kann geheime Daten in der Playground-Umgebung einsehen',
    group: 'Allgemein',
  },

  // === BAN & UNBAN ===
  {
    id: PermissionId.CAN_BAN_AUTHORIZATION,
    name: 'Kann Benutzerkonten sperren (Bannen)',
    group: 'Benutzerverwaltung',
  },
  {
    id: PermissionId.CAN_UNBAN_AUTHORIZATION,
    name: 'Kann Benutzerkonten entsperren (Entbannen)',
    group: 'Benutzerverwaltung',
  },

  // === ROLE MANAGEMENT ===
  {
    id: PermissionId.CAN_READ_ROLE,
    name: 'Rollenverwaltung: Kann Rollen einsehen',
    group: 'Rollenverwaltung',
  },
  {
    id: PermissionId.CAN_CREATE_ROLE,
    name: 'Rollenverwaltung: Kann neue Rollen erstellen',
    group: 'Rollenverwaltung',
  },
  {
    id: PermissionId.CAN_UPDATE_ROLE,
    name: 'Rollenverwaltung: Kann Rollen bearbeiten',
    group: 'Rollenverwaltung',
  },
  {
    id: PermissionId.CAN_DELETE_ROLE,
    name: 'Rollenverwaltung: Kann Rollen löschen',
    group: 'Rollenverwaltung',
  },
];
