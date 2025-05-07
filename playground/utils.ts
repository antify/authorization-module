import {
  TEST_TENANT_ID,
} from './server/datasources/db/fixture-utils/tenant';
import type {
  JsonWebToken,
} from '#authorization-module';

export const defaultToken: JsonWebToken = {
  id: 'authorization-id',
  tenantId: TEST_TENANT_ID,
  isAdmin: true,
  permissions: [],
};
