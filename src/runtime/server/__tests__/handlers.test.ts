import {describe, test, expect, vi} from 'vitest';
import {isAuthorizedHandler, isLoggedInHandler} from '../handlers';
import {expiredToken, validToken} from '../../__tests__/testTokens';

vi.mock('#imports', () => {
  return {
    useRuntimeConfig: () => ({
      authorizationModule: {
        jwtSecret: 'secret',
        jwtExpiration: 480,
        tokenCookieName: 'token',
        passwordSalt: 'secret'
      }
    }),
    getCookie: () => {
    },
    setCookie: () => {
    },
  };
});

// TODO:: improve tests - test statuscodes too
describe('handlers test', async () => {
  test('should emit if user is not logged in', async () => {
    expect.assertions(2);

    try {
      await isLoggedInHandler({
        headers: {
          authorization: expiredToken
        }
      });
    } catch (e) {
      expect(e.statusCode).toBe(401);
      expect(e.statusMessage).toBe('Unauthorized');
    }
  });

  test('should emit if user is logged in', async () => {
    const guard = await isLoggedInHandler({
      headers: {
        authorization: validToken
      }
    });

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should emit if user is authorized correctly', async () => {
    const guard = await isAuthorizedHandler(
      {
        headers: {
          authorization: validToken
        }
      },
      'CAN_TEST',
      'core'
    );

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should emit if user is not authorized correctly', async () => {
    expect.assertions(1);

    try {
      await isAuthorizedHandler(
        {
          headers: {
            authorization: validToken
          }
        },
        'CAN_TEST',
        'tenant',
        'notExistingOne'
      );
    } catch (e) {
      expect(e.message).toBe('Forbidden');
    }
  });
});
