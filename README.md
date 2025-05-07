# Authorization Module

This module is responsible for handling user authorization using JWT.
It ships with a set of components and utils to make it easy to integrate authorization into your application.
It also supports multitenancy.

## Architecture

This module supports different permissions in different multi-tenant instances.
All permissions should be stored in one application instance.

To encapsulate the authorization logic from your main application, this module provides an Authorization object.
Extend your applications Account or User model with the Authorization object to extend your app with
authorization functionality.

### Permission

There's a global set of permissions. An authorization can have multiple permissions
for each tenant.

### Role

To make the usage of permissions easier, there are roles. A role can have multiple permissions.
Each tenant have it own set of roles.

### Admin

An authorization can be an admin. An admin has all permissions
independent of the associated permissions.

### Ban

An authorization can be banned.

The isBan flag always is more important than the isAdmin flag.
E. g.: A banned user has no permissions, even if he is an admin.

An authenticated user always get a valid token, even he's banned.
This gives the possibility to redirect him to login page OR show him a jail page.

### Access hierarchy

To emit if an authorization has access with a specific permission,
following hierarchy is used:

- Is banned
- Is admin
- Has permission

## TODO::

- [ ] Add validator which check the tokens structure on runtime.
- [ ] Add refresh token process
- [ ] Add access token process
- [ ] Cleanup module.ts
- [ ] Composable to reach all permissions in system
- [ ] Find a way to handle permissions properly across modules
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

Button to ban and unban a user.

It does:

- Switch between ban and unban
- Does not allow a user to ban / unban himself
- Check if the user has the expected permission to ban / unban (`CAN_BAN_AUTHORIZATION` | `CAN_UNBAN_AUTHORIZATION` | is
  an admin)

### AuthorizationModuleJailPage

A default jail page to show a user that he is banned.

## Important

### Populate the authorization.roles

Because `.roles` is a relation to the roles table, you need to populate it.
Also be careful, you need to add the model property to the populate method, because @antify/database
is a multi connection client. To make mongoose work properly, you need to specify the model.
Read more about
it [here](https://github.com/antify/database?tab=readme-ov-file#error-schema-hasnt-been-registered-for-model).

```typescript
const user = await UserModel
  .findOne({_id: userId})
  .populate({
    path: 'authorization.roles',
    model: client.getModel(defineRoleSchema)
  });
```

## Development

- Run `pnpm run dev:prepare` to generate type stubs.
- Use `pnpm run dev` to start [playground](./playground) in development mode.
