import {
  TEST_TENANT_ID,
} from '../../../../playground/server/datasources/db/fixture-utils/tenant';
import {
  Authorization,
} from '~/src/runtime/server';
import {
  describe, test, expect, vi, beforeEach,
} from 'vitest';
import {
  changedToken,
  expiredToken,
  tokenWithoutExp,
  validToken,
  wrongSecretToken,
} from '../../__tests__/testTokens';
import {
  useAuth,
} from '../auth';
import {
  createError as _createError, H3Event,
} from 'h3';

const {
  useEventReader,
} = vi.hoisted(() => {
  return {
    useEventReader: vi.fn(),
  };
});

vi.mock('#imports', () => {
  return {
    useRuntimeConfig: () => ({
      authorizationModule: {
        jwtSecret: '#a!SuperSecret123',
        jwtExpiration: 480,
        tokenCookieName: 'token',
      },
    }),
  };
});

vi.mock('h3', () => {
  return {
    getCookie: () => {
    },
    setCookie: () => {
    },
  };
});

vi.mock('../utils', () => {
  return {
    useEventReader,
  };
});

describe('Auth test', async () => {
  async function testErrorCaseWithToken(rawToken: string | null, errorCode: string) {
    expect.assertions(1);

    useEventReader.mockImplementation(() => ({
      getTenantId: () => {
        return TEST_TENANT_ID;
      },
      getToken: () => {
        return rawToken;
      },
    }));

    try {
      await useAuth().verify({} as H3Event);
    } catch (e) {
      expect(e.code).toBe(errorCode);
    }
  }

  test('should validate a valid token correctly', async () => {
    useEventReader.mockImplementation(() => ({
      getTenantId: () => {
        return TEST_TENANT_ID;
      },
      getToken: () => {
        return validToken;
      },
    }));

    const guard = await useAuth().verify({} as H3Event);

    expect(guard.isLoggedIn()).toBeTruthy();
  });

  test('should validate a token without exp correctly', async () => {
    await testErrorCaseWithToken(tokenWithoutExp, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED');
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
      isBanned: false,
      tenantId: TEST_TENANT_ID,
      roles: [
        {
          _id: '661f73b3e90e013526837a00',
          name: 'foo',
          isAdmin: true,
          permissions: [
            'CAN_TEST',
          ],
        },
      ],
      allPermissions: [
        'CAN_TEST',
      ],
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
      id: '661f73b3e90e013526837a00',
      isAdmin: true,
      isBanned: false,
      permissions: [
        'CAN_TEST',
      ],
      tenantId: '63e398316c6c22a1f5479ab6',
    });
  });
});
