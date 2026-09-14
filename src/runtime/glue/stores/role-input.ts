import {
  object, type InferType, string, array,
} from 'yup';

export const responseSchema = array(object({
  label: string().defined(),
  value: string().defined(),
}));

export type ResponseType = InferType<typeof responseSchema>;
