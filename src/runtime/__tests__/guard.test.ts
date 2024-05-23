/**
 * @vitest-environment jsdom
 */
import {describe, test, expect} from 'vitest';
import {Guard} from '../guard';

describe('Guard tests', async () => {
	const superAdminToken = {
		'id': 'test-id',
		'isSuperAdmin': true,
		'apps': [
			{
				'appId': 'core',
				'tenantId': '',
				'permissions': [
					'CAN_TEST'
				]
			},
			{
				'appId': 'tenant',
				'tenantId': 'one',
				'permissions': [
					'CAN_TEST'
				]
			},
			{
				'appId': 'tenant',
				'tenantId': 'two',
				'permissions': [
					'CAN_TEST'
				]
			}
		],
		'exp': 32524370248,
		'iat': 1693214248
	};
	const adminToken = {
		'id': 'test-id',
		'isSuperAdmin': false,
		'apps': [
			{
				'isAdmin': true,
				'appId': 'core',
				'tenantId': '',
				'permissions': [
					'CAN_TEST'
				]
			},
			{
				'isAdmin': true,
				'appId': 'tenant',
				'tenantId': 'one',
				'permissions': [
					'CAN_TEST'
				]
			},
			{
				'isAdmin': true,
				'appId': 'tenant',
				'tenantId': 'two',
				'permissions': [
					'CAN_TEST'
				]
			}
		],
		'exp': 32524370248,
		'iat': 1693214248
	};
	const normalToken = {
		'id': 'test-id',
		'isSuperAdmin': false,
		'apps': [
			{
				'isAdmin': false,
				'appId': 'core',
				'tenantId': '',
				'permissions': [
					'CAN_TEST'
				]
			},
			{
				'isAdmin': false,
				'appId': 'tenant',
				'tenantId': 'one',
				'permissions': [
					'CAN_TEST'
				]
			},
			{
				'isAdmin': false,
				'appId': 'tenant',
				'tenantId': 'two',
				'permissions': [
					'CAN_TEST'
				]
			}
		],
		'exp': 32524370248,
		'iat': 1693214248
	};
	const bannedAuthorizationToken = {
		'id': 'test-id',
		'isSuperAdmin': false,
		'isBanned': true,
		'apps': [
			{
				'isAdmin': false,
				'isBanned': true,
				'appId': 'core',
				'tenantId': '',
				'permissions': [
					'CAN_TEST'
				]
			},
		],
		'exp': 32524370248,
		'iat': 1693214248
	};
	const bannedAppToken = {
		'id': 'test-id',
		'isSuperAdmin': false,
		'isBanned': true,
		'apps': [
			{
				'isAdmin': false,
				'isBanned': true,
				'appId': 'core',
				'tenantId': '',
				'permissions': [
					'CAN_TEST'
				]
			},
		],
		'exp': 32524370248,
		'iat': 1693214248
	};

	test('should give access to a super admin to a single connection', async () => {
		const guard = new Guard(superAdminToken);

		expect(guard.isLoggedIn()).toBe(true);
		expect(guard.isSuperAdmin()).toBe(true);
		expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_TEST'], 'core')).toBe(true);
		expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'core')).toBe(true);
	});

	test('should give access to a super admin to a multi connection', async () => {
		const guard = new Guard(superAdminToken);

		expect(guard.isLoggedIn()).toBe(true);
		expect(guard.isSuperAdmin()).toBe(true);
		expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_TEST'], 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'tenant', 'one')).toBe(true);
	});

	test('should give access to an admin to a single connection', async () => {
		const guard = new Guard(adminToken);

		expect(guard.isLoggedIn()).toBe(true);
		expect(guard.isSuperAdmin()).toBe(false);
		expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_TEST'], 'core')).toBe(true);
		expect(guard.hasPermissionTo('CAN_NOT_TEST', 'core')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'core')).toBe(true);
	});

	test('should give access to an admin to a multi connection', async () => {
		const guard = new Guard(adminToken);

		expect(guard.isLoggedIn()).toBe(true);
		expect(guard.isSuperAdmin()).toBe(false);
		expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_TEST'], 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'tenant', 'one')).toBe(true);
	});

	test('should give access to a normal user to a single connection', async () => {
		const guard = new Guard(normalToken);

		expect(guard.isLoggedIn()).toBe(true);
		expect(guard.isSuperAdmin()).toBe(false);
		expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_TEST'], 'core')).toBe(true);
		expect(guard.hasPermissionTo('CAN_NOT_TEST', 'core')).toBe(false);
		expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'core')).toBe(false);
	});

	test('should give access to a normal user to a multi connection', async () => {
		const guard = new Guard(normalToken);

		expect(guard.isLoggedIn()).toBe(true);
		expect(guard.isSuperAdmin()).toBe(false);
		expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo(['CAN_TEST'], 'tenant', 'one')).toBe(true);
		expect(guard.hasPermissionTo('CAN_NOT_TEST', 'tenant', 'one')).toBe(false);
		expect(guard.hasPermissionTo(['CAN_NOT_TEST'], 'tenant', 'one')).toBe(false);
	});

	test('should not give access to a normal user to a multi connection with a tenant which does not exists', async () => {
		const guard = new Guard(normalToken);

		expect(guard.hasPermissionTo('CAN_TEST', 'tenant', 'notExistingOne')).toBe(false);
	});

	test('should not give access to a normal user to a connection which does not exists', async () => {
		const guard = new Guard(normalToken);

		expect(guard.hasPermissionTo('CAN_TEST', 'notExistingOne')).toBe(false);
	});

	test('should not give access to a user which is banned system-wide', async () => {
		const guard = new Guard(bannedAuthorizationToken);

		expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBe(false);
	});

	test('should not give access to a user which is banned for a app', async () => {
		const guard = new Guard(bannedAppToken);

		expect(guard.hasPermissionTo('CAN_TEST', 'core')).toBe(false);
	});
});
