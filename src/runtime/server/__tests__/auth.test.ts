import {describe, test, expect, vi} from 'vitest';
import {useAuth} from '../auth';
import {
  changedToken,
  expiredToken,
  tokenWithoutExp,
  validToken,
  wrongSecretToken
} from '../../__tests__/testTokens';
import {Authorization} from '~/src/runtime/server';
import {H3Event} from 'h3';

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

    expect(guard.isLoggedIn()).toBeFalsy();
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
    const authorization: Authorization = {
      _id: '661f73b3e90e013526837a00',
      isSuperAdmin: false,
      isBanned: false,
      appAccesses: [
        {
          _id: '661f73b3e90e013526837a00',
          appId: 'core',
          tenantId: '',
          roles: [
            {
              _id: '661f73b3e90e013526837a00',
              appId: 'core',
              tenantId: '',
              name: 'foo',
              isAdmin: true,
              permissions: ['CAN_TEST']
            }
          ],
          isBanned: false
        }
      ]
    };

    const token = (await useAuth()
      .login({} as unknown as H3Event, authorization))
      .getToken();

    expect(token).toHaveProperty('exp');
    expect(token?.exp).toBeGreaterThan(Math.round(new Date().getTime() / 1000));
    expect(token).toHaveProperty('iat');
    expect(token?.iat).toBeLessThanOrEqual(Math.round(new Date().getTime() / 1000));

    delete token?.exp;
    delete token?.iat;

    expect(token).toStrictEqual({
      apps: [
        {
          appId: 'core',
          isAdmin: true,
          isBanned: false,
          permissions: [
            'CAN_TEST',
          ],
          tenantId: '',
        },
      ],
      id: '661f73b3e90e013526837a00',
      isBanned: false,
      isSuperAdmin: false,
    });
  });
});
