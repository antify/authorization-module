# Authorization Module

This module is responsible for handling user authorization using JWT.
It ships with a set of components and utils to make it easy to integrate authorization into your application.

## Architecture

This module supports different permissions in different multi-tenant applications.
All permissions should be stored in one application instance.

To encapsulate the authorization logic from your main application, this module provides an Authorization object.
Extend your applications Account or User model with the Authorization object to extend your app with 
authorization functionality.

### Permission

There's a global set of permissions. An authorization can have multiple permissions 
for each app and tenant.

### Role

To make the usage of permissions easier, there are roles. A role can have multiple permissions.
Each tenant can have it own set of roles.

### Admin

An authorization can be an admin in two ways:
- System-wide
- Per tenant

### Ban

An authorization can be banned in two ways:
- System-wide
- Per tenant

The isBan flag always is more important than the isAdmin flag.
E. g.: A banned user has no permissions, even if he is an admin or super admin.

An authenticated user always get a valid token, even he's system-wide banned. 
This gives the possibility to redirect him to login page OR show him a jail page.

A banned authorization for a specific tenant also get a valid token to give him access to other tenants 
where he is not banned.

### Access hierarchy

To emit if an authorization has access to a specific tenant with a specific permission,
following hierarchy is used:

- System-wide ban
- Is super admin
- Is banned in app
- Is admin in app
- Has permission in app

## TODO::

- [ ] Add validator which check the tokens structure on runtime.
- [ ] Make sure that a AppAccess appId and tenantId is the same as the roles appId and tenantId
- [ ] Add refresh token process
- [ ] Add access token process
- [ ] Cleanup module.ts
- [ ] Select multiple Roles components
- [ ] Add roles CRUD
- [ ] Composable to reach all permissions in system
- [ ] Find a way to handle permissions properly across modules
- [ ] Fix and add tests
- [ ] Force logout or refresh token function to logout/ban all devices fast

## Usage

### Installation

```bash
pnpm i @antify/authorization-module
```

Add it to your `nuxt.config.ts`:

```typescript
export default {
	modules: [
		'@antify/authorization-module'
	]
}
```

### Configuration

```typescript
TODO
```

## Components

TODO:: Describe it

### AuthorizationModuleBanAuthorizationButton

Button to ban and unban a user system-wide.

It does:
- Switch between ban and unban
- Does not allow a user to ban / unban himself
- Check if the user has the expected permission to ban / unban (`CAN_BAN_AUTHORIZATION` | `CAN_UNBAN_AUTHORIZATION` | is an admin | is an super admin)

### AuthorizationModuleBanProviderAccessButton

Button to ban and unban a user from a tenant.

It does:
- Switch between ban and unban
- Does not allow a user to ban / unban himself
- Check if the user has the expected permission to ban / unban (`CAN_BAN_PROVIDER_ACCESS` | `CAN_UNBAN_PROVIDER_ACCESS` | is an admin | is a super admin)
- Check if the user has the expected permission to ban / unban an administrator  (`CAN_BAN_ADMIN_PROVIDER_ACCESS` | `CAN_UNBAN_ADMIN_PROVIDER_ACCESS` | is an admin | is a super admin)

### AuthorizationModuleJailPage

A default jail page to show a user that he is banned.

## Important

### Populate the authorization.appAccesses.roles

Because `appAccesses.roles` is a relation to the roles table, you need to populate it.
Also be careful, you need to add the model property to the populate method, because @antify/database
is a multi connection client. To make mongoose work properly, you need to specify the model.
Read more about
it [here](https://github.com/antify/database?tab=readme-ov-file#error-schema-hasnt-been-registered-for-model).

```typescript
const user = await UserModel
	.findOne({_id: userId})
	.populate({
		path: 'authorization.appAccesses.roles',
		model: client.getModel<Role>('authorization_roles')
	});
```

## Development

- Run `pnpm run dev:prepare` to generate type stubs.
- Use `pnpm run dev` to start [playground](./playground) in development mode.
