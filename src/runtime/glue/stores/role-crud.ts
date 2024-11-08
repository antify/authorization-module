import {object, type InferType, string, boolean, array} from 'yup';

export const roleServerSchema = object({
  _id: string().nullable().defined(),
  name: string().defined(),
  isAdmin: boolean().defined(),
  permissions: array(string()).defined()
});
export const roleClientSchema = object({
  _id: string().nullable().defined().default(null),
  name: string().nullable().defined().default(null),
  isAdmin: boolean().defined().default(false),
  permissions: array(string()).defined().default([])
});

export type RoleClientType = InferType<typeof roleClientSchema>;
export type RoleServerType = InferType<typeof roleServerSchema>;
