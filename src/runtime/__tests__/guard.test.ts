/**
 * @vitest-environment jsdom
 */
import {describe, test, expect} from 'vitest';
import {Guard} from '../guard';

describe('Guard tests', async () => {
  const adminToken = {
    'id': 'test-id',
    'isAdmin': true,
    'tenantId': 'myTenant',
    'permissions': [],
    'exp': 32524370248,
    'iat': 1693214248
  };
  const normalToken = {
    'id': 'test-id',
    'isAdmin': false,
    'tenantId': 'myTenant',
    'permissions': [
      'CAN_TEST'
    ],
    'exp': 32524370248,
    'iat': 1693214248
  };
  const bannedAuthorizationToken = {
    'id': 'test-id',
    'isBanned': true,
    'isAdmin': false,
    'tenantId': 'myTenant',
    'permissions': [
      'CAN_TEST'
    ],
    'exp': 32524370248,
    'iat': 1693214248
  };


  test('should give access to an admin', async () => {
    const guard = new Guard(adminToken, 'myTenant');

    expect(guard.isLoggedIn()).toBe(true);
    expect(guard.isAdmin()).toBe(true);
    expect(guard.hasPermissionTo('CAN_TEST')).toBe(true);
    expect(guard.hasPermissionTo(['CAN_TEST'])).toBe(true);
    expect(guard.hasPermissionTo('CAN_NOT_TEST')).toBe(true);
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'])).toBe(true);
  });

  test('should give access to a normal user to a multi connection', async () => {
    const guard = new Guard(normalToken, 'myTenant');

    expect(guard.isLoggedIn()).toBe(true);
    expect(guard.isAdmin()).toBe(false);
    expect(guard.hasPermissionTo('CAN_TEST')).toBe(true);
    expect(guard.hasPermissionTo(['CAN_TEST'])).toBe(true);
    expect(guard.hasPermissionTo('CAN_NOT_TEST')).toBe(false);
    expect(guard.hasPermissionTo(['CAN_NOT_TEST'])).toBe(false);
  });

  test('should not give access to a normal user to a tenant which does not exists', async () => {
    const guard = new Guard(normalToken, 'notExistingOne');

    expect(guard.hasPermissionTo('CAN_TEST')).toBe(false);
  });

  test('should not give access to a user which is banned', async () => {
    const guard = new Guard(bannedAuthorizationToken, 'myTenant');

    expect(guard.hasPermissionTo('CAN_TEST')).toBe(false);
  });
});
