import {expiredToken, validToken} from '../../__tests__/testTokens';
import {isAuthorizedHandler, isLoggedInHandler} from '../handlers';
import {describe, test, expect, vi, beforeEach} from 'vitest';
import {createError as _createError} from 'h3';
import {decodeJwt, errors} from 'jose';
import {Guard} from '../../guard';

const {
  isValidAppContextHandler,
  useAuth,
  createError
} = vi.hoisted(() => {
  return {
    isValidAppContextHandler: vi.fn(),
    useAuth: vi.fn(),
    createError: vi.fn()
  };
});

vi.mock('../auth', () => {
  return {
    useAuth
  };
});

vi.mock('#imports', () => {
  return {
    createError
  };
});

// TODO:: improve tests - test status codes too
describe('handlers test', async () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    createError.mockImplementation(_createError);
  });

  describe('isLoggedInHandler', async () => {
    test('should emit if user is not logged in', async () => {
      expect.assertions(2);

      useAuth.mockImplementationOnce(() => {
        return {
          verify: () => {
            throw new errors.JWSInvalid();
          }
        };
      });

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
      useAuth.mockImplementationOnce(() => {
        return {
          verify: (event) => {
            return new Guard(decodeJwt(event.headers.authorization));
          }
        };
      });

      const guard = await isLoggedInHandler({
        headers: {
          authorization: validToken
        }
      });

      expect(guard.isLoggedIn()).toBeTruthy();
    });
  });

  describe('isAuthorizedHandler', async () => {
    test('should emit if user is authorized correctly', async () => {
      isValidAppContextHandler.mockImplementationOnce(() => {
        return {appId: 'core', tenantId: ''};
      });
      useAuth.mockImplementationOnce(() => {
        return {
          verify: (event) => {
            return new Guard(decodeJwt(event.headers.authorization));
          }
        };
      });

      const guard = await isAuthorizedHandler(
        {
          headers: {
            authorization: validToken
          }
        },
        'CAN_TEST'
      );

      expect(guard.isLoggedIn()).toBeTruthy();
    });

    test('should emit if user is not authorized correctly', async () => {
      expect.assertions(1);

      isValidAppContextHandler.mockImplementationOnce(() => {
        return {appId: 'tenant', tenantId: 'notExistingOne'};
      });
      useAuth.mockImplementationOnce(() => {
        return {
          verify: (event) => {
            return new Guard(decodeJwt(event.headers.authorization));
          }
        };
      });

      try {
        await isAuthorizedHandler(
          {
            headers: {
              authorization: validToken
            }
          },
          'CAN_TEST'
        );
      } catch (e) {
        expect(e.message).toBe('Forbidden');
      }
    });
  });
});
