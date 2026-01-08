import {
  defineAppHandlerFactory,
} from '#imports';

export default defineAppHandlerFactory((tenantId) => ({
  onUnauthorized: () => {
    console.error('Unauthorized - Called from appHandlerFactory');
  },
  onBanned: () => {
    console.error('Banned - Called from appHandlerFactory');
  },
}));
