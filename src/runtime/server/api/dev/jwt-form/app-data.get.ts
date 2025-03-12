import {defineEventHandler, useRuntimeConfig} from '#imports';

export default defineEventHandler(async () => {
  const {permissions} = useRuntimeConfig().authorizationModule;

  // TODO:: Return a list of tenants and extend Tenand ID with a select field
  // TODO:: On dev mode only!!
  return {
    permissions
  };
});
