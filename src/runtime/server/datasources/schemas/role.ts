import {defineSchema} from '@antify/database';
import {useRoleSchema} from '../role';

export default defineSchema(async (client) => {
  client.getSchema('authorization_roles').add(useRoleSchema());
});
