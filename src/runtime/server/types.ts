export type Role = {
  _id: string;
  isAdmin: boolean;
  name: string;
  permissions: string[];
};

export type Authorization = {
  _id: string;
  roles: Role[];
  isBanned: boolean;
  isAdmin: boolean;
  allPermissions: string[];
};

export type {
  SecurityRule,
} from './utils/auth-wrapper';
