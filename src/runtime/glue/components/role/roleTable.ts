import type {RoleServerType} from '../../stores/role-crud';

export type RoleListingData = {
  users: Omit<RoleServerType, '_id' | 'name'>[]
  count: number
}
