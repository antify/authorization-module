import {describe, test, expect, vi} from 'vitest';
import {useAuth} from '../auth';
import {
  changedToken,
  expiredToken,
  tokenWithoutExp,
  validToken,
  wrongSecretToken
} from '../../__tests__/testTokens';

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

describe('Auth test', async () => {
  async function testErrorCaseWithToken(rawToken: string | null, errorCode: string) {
    expect.assertions(1);

    try {
      await useAuth().verify({
        headers: {
          authorization: rawToken
        }
      });
    } catch (e) {
      expect(e.code).toBe(errorCode);
    }
  }

  test('should validate a valid token correctly', async () => {
    const guard = await useAuth().verify({
      headers: {
        authorization: validToken
      }
    });

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should validate a token without exp correctly', async () => {
    const guard = await useAuth().verify({
      headers: {
        authorization: tokenWithoutExp
      }
    });

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should validate an expired token correctly', async () => {
    await testErrorCaseWithToken(expiredToken, 'ERR_JWT_EXPIRED');
  });

  test('should validate an invlaid token correctly', async () => {
    await testErrorCaseWithToken(wrongSecretToken, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED');
  });

  test('should validate a changed token correctly', async () => {
    await testErrorCaseWithToken(changedToken, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED');
  });

  test('should validate a empty token correctly', async () => {
    await testErrorCaseWithToken('', 'ERR_JWS_INVALID');
  });

  test('should validate a not existing token correctly', async () => {
    await testErrorCaseWithToken(null, 'ERR_JWS_INVALID');
  });

  test('should create a token correctly', async () => {
    const decodedToken = {
      'id': 'test-id',
      'isSuperAdmin': false,
      'apps': [
        {
          'isAdmin': false,
          'appId': 'core',
          'tenantId': '',
          'permissions': [
            'CAN_TEST'
          ]
        },
        {
          'isAdmin': false,
          'appId': 'tenant',
          'tenantId': 'one',
          'permissions': [
            'CAN_TEST'
          ]
        },
        {
          'isAdmin': false,
          'appId': 'tenant',
          'tenantId': 'two',
          'permissions': [
            'CAN_TEST'
          ]
        }
      ]
    };

    const token = (await useAuth()
      .login({}, decodedToken))
      .getToken();

    expect(token).toHaveProperty('exp');
    expect(token['exp']).toBeGreaterThan(Math.round(new Date().getTime() / 1000));
    expect(token).toHaveProperty('iat');
    expect(token['iat']).toBeLessThanOrEqual(Math.round(new Date().getTime() / 1000));

    delete token['exp'];
    delete token['iat'];

    expect(token).toStrictEqual(decodedToken);
  });
});
