import {
  object, type InferType, string, array, mixed, boolean,
} from 'yup';

export const responsePermissionSchema = object({
  id: string().defined(),
  name: string().defined(),
  group: string().optional(),
  isLeading: boolean().optional(),
});

export const responseSchema = mixed().oneOf([
  object({
    role: object({
      _id: string().defined(),
      name: string().defined(),
    }),
    allPermissions: array(responsePermissionSchema),
  }),
  object({
    notFound: boolean().isTrue().defined(),
  }),
]);

export type ResponseType = InferType<typeof responseSchema>;
export type ResponsePermissionType = InferType<typeof responsePermissionSchema>;
