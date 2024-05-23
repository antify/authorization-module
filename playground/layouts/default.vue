<script setup lang='ts'>
import {defaultToken} from '../utils';
import {TEST_TENANT_ID} from '../server/datasources/db/core/fixture-utils/tenant';

const navItems = [
	{
		label: 'Home',
		to: {name: 'index'}
	},
	{
		label: 'Server side',
		to: {name: 'server-side'}
	},
	{
		label: 'Protected area',
		children: [
			{
				label: 'Core app',
				to: {name: 'protected-area-core'}
			},
			{
				label: 'Tenant app',
				to: {name: 'protected-area-tenantId', params: {tenantId: TEST_TENANT_ID}}
			}
		]
	},
	{
		label: 'CRUD',
		children: [
			{
				label: 'Roles single tenancy',
				to: {name: 'roles'}
			},
			{
				label: 'Roles multi tenancy',
				to: {name: 'tenants-tenantId-roles', params: {tenantId: TEST_TENANT_ID}}
			}
		]
	},
	{
		label: 'Components',
		children: [
			{
				label: 'Ban buttons',
				to: {name: 'components-ban-buttons'}
			},
			{
				label: 'Role input',
				to: {name: 'components-role-input'}
			},
			{
				label: 'Jail page',
				to: {name: 'components-jail'}
			}
		]
	},
];
</script>

<template>
  <AntNavLeftLayout :navbar-items="navItems">
    <AntContent class="h-full">
      <slot />
    </AntContent>

    <AuthorizationModuleJWTHelper
      :default-token="defaultToken"
    />
    <AntToaster />
  </AntNavLeftLayout>
</template>
