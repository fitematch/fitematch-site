import { http, HttpResponse } from '@/tests/mocks/msw-lite';
import { API_ENDPOINTS, apiUrl, mockDb } from './state';

export const authHandlers = [
  http.post(apiUrl(API_ENDPOINTS.AUTH_SIGN_IN), async ({ request }) => {
    if (mockDb.auth.signInStatus !== 200) {
      return HttpResponse.json(
        { message: mockDb.auth.signInErrorMessage },
        { status: mockDb.auth.signInStatus }
      );
    }

    const payload = (await request.json()) as { email: string; password: string };

    return HttpResponse.json({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: {
        ...mockDb.auth.meUser,
        email: payload.email,
      },
    });
  }),
  http.get(apiUrl(API_ENDPOINTS.AUTH_ME), () => {
    if (mockDb.auth.meStatus !== 200 || !mockDb.auth.meUser) {
      return HttpResponse.json(
        { message: 'Usuário não encontrado.' },
        { status: mockDb.auth.meStatus }
      );
    }

    return HttpResponse.json(mockDb.auth.meUser);
  }),
  http.get(apiUrl(API_ENDPOINTS.AUTH_SESSIONS), () => {
    if (mockDb.auth.sessionsStatus !== 200) {
      return HttpResponse.json(
        { message: mockDb.auth.sessionsErrorMessage },
        { status: mockDb.auth.sessionsStatus }
      );
    }

    return HttpResponse.json(mockDb.auth.sessions);
  }),
  http.patch(apiUrl(API_ENDPOINTS.AUTH_REVOKE_SESSION(':sessionId')), ({ params }) => {
    const sessionId = String(params.sessionId);
    mockDb.auth.sessions = mockDb.auth.sessions.filter(
      (session) => session.id !== sessionId
    );

    return new HttpResponse(null, { status: 204 });
  }),
  http.post(apiUrl(API_ENDPOINTS.AUTH_SIGN_OUT), () =>
    HttpResponse.json(
      { message: mockDb.auth.signOutMessage },
      { status: mockDb.auth.signOutStatus }
    )
  ),
];
