import type {
  H3Event,
} from 'h3';
import {
  isAuthorizedHandler, isLoggedInHandler,
} from '#authorization-module';
import {
  defineEventHandler,
} from '#imports';

export default defineEventHandler(async (event: H3Event) => {
  await isLoggedInHandler(event);

  return {
    default: 'Secret data!',
  };
});
