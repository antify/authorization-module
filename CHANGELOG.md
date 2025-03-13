# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/antify/authorization-module/compare/v2.1.3...v2.2.0) (2025-03-13)


### Features

* **RoleInput:** Add disabled and skeleton prop ([3b31d69](https://github.com/antify/authorization-module/commit/3b31d69e4762e2f2ef29ab1b2f23bd0e1e9e1d5f))

### [2.1.3](https://github.com/antify/authorization-module/compare/v2.1.2...v2.1.3) (2025-03-12)


### Bug Fixes

* Fix concept error. Do not store tenantId in database ([c643370](https://github.com/antify/authorization-module/commit/c643370a157dacf82132a0d619ad4f2809c70eeb))

### [2.1.2](https://github.com/antify/authorization-module/compare/v2.1.1...v2.1.2) (2025-03-12)


### Bug Fixes

* Fix not saveable schema with null as tenantId ([f2081c7](https://github.com/antify/authorization-module/commit/f2081c7a9a945edb76693fb77c82477a58b48bba))

### [2.1.1](https://github.com/antify/authorization-module/compare/v2.1.0...v2.1.1) (2025-03-12)

## [2.1.0](https://github.com/antify/authorization-module/compare/v2.0.0...v2.1.0) (2025-03-12)


### Features

* Add isBanned to client guard ([9c9bf22](https://github.com/antify/authorization-module/commit/9c9bf22fad27496f91e7133993a56e7d0fb6e1ea))

## [2.0.0](https://github.com/antify/authorization-module/compare/v1.2.1...v2.0.0) (2025-03-12)


### ⚠ BREAKING CHANGES

* The authorization module now just support one security context per nuxt project. But it still supports multitenancy

### Features

* Remove multi app support ([8fe5303](https://github.com/antify/authorization-module/commit/8fe530321765c65709dcedfa3fd48b843bc1cfea))

### [1.2.1](https://github.com/antify/authorization-module/compare/v1.2.0...v1.2.1) (2025-02-11)

## [1.2.0](https://github.com/antify/authorization-module/compare/v1.1.1...v1.2.0) (2024-11-12)


### Features

* Finish role crud and RoleInput ([dab19a1](https://github.com/antify/authorization-module/commit/dab19a1c916c0962bb1bc6fe87686110f58c0b40))

### [1.1.1](https://github.com/antify/authorization-module/compare/v1.1.0...v1.1.1) (2024-08-23)

## [1.1.0](https://github.com/antify/authorization-module/compare/v1.0.2...v1.1.0) (2024-08-14)


### Features

* Make module usable as package too ([e288d15](https://github.com/antify/authorization-module/commit/e288d1511e6941fa498b80f521a78fbb3f679d41))

### [1.0.2](https://github.com/antify/authorization-module/compare/v1.0.1...v1.0.2) (2024-08-12)

### [1.0.1](https://github.com/antify/authorization-module/compare/v1.0.0...v1.0.1) (2024-08-12)


### Bug Fixes

* Fix nuxt warning in browser to use message instead of statusMessage ([762fc00](https://github.com/antify/authorization-module/commit/762fc003d0c3f1fb992af65dbc12816e37306554))

## 1.0.0 (2024-05-24)

### Features

* Bump app-context-module to
  v1.2.0 ([9aecdba](https://github.com/antify/authorization-module/commit/9aecdba5de42c2937c4e135608c8e50473b05f1c))

### Bug Fixes

* **types:** Fix exporting undefined type and change file
  name ([3f2da3b](https://github.com/antify/authorization-module/commit/3f2da3b6301ed41d8afc3848e4c562d949299d8f))
