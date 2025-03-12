import {TEST_TENANT_ID} from '../../../../playground/server/datasources/db/fixture-utils/tenant';
import {expiredToken, validToken} from '../../__tests__/testTokens';
import {isAuthorizedHandler, isLoggedInHandler} from '../handlers';
import {describe, test, expect, vi, beforeEach} from 'vitest';
import {createError as _createError} from 'h3';
import {decodeJwt, errors} from 'jose';
import {Guard} from '../../guard';

const {
  useAuth,
  createError
} = vi.hoisted(() => {
  return {
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
            return new Guard(decodeJwt(event.headers.authorization), TEST_TENANT_ID);
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
      useAuth.mockImplementationOnce(() => {
        return {
          verify: (event) => {
            return new Guard(decodeJwt(event.headers.authorization), TEST_TENANT_ID);
          }
        };
      });

      const guard = await isAuthorizedHandler(
        {
          headers: {
            authorization: validToken
          }
        },
        'CAN_READ_SECRET_DATA'
      );

      expect(guard.isLoggedIn()).toBeTruthy();
    });

    test('should emit if user is not authorized correctly', async () => {
      expect.assertions(1);

      useAuth.mockImplementationOnce(() => {
        return {
          verify: (event) => {
            return new Guard(decodeJwt(event.headers.authorization), 'not-existing-tenant-id');
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
          'CAN_READ_SECRET_DATA'
        );
      } catch (e) {
        expect(e.message).toBe('Forbidden');
      }
    });
  });
});
