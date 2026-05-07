type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type MockRequestInput = string | URL | Request;

class MockRequest {
  readonly url: string;
  readonly method: string;
  readonly headers: Headers;
  private readonly body: BodyInit | null | undefined;

  constructor(input: MockRequestInput, init?: RequestInit) {
    if (typeof input === 'string' || input instanceof URL) {
      this.url = String(input);
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = init?.body;

       if (this.body instanceof FormData && !this.headers.get('content-type')) {
        this.headers.set('content-type', 'multipart/form-data; boundary=----jest-formdata');
      }

      return;
    }

    this.url = input.url;
    this.method = input.method;
    this.headers = input.headers;
    this.body = null;
  }

  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body);
    }

    return this.body;
  }

  async formData() {
    if (this.body instanceof FormData) {
      return this.body;
    }

    throw new Error('Request body is not FormData.');
  }
}

class SimpleHeaders {
  private readonly values = new Map<string, string>();

  constructor(init?: HeadersInit) {
    if (!init) {
      return;
    }

    const source = new Headers(init);

    source.forEach((value, key) => {
      this.values.set(key.toLowerCase(), value);
    });
  }

  get(name: string) {
    return this.values.get(name.toLowerCase()) ?? null;
  }
}

export class HttpResponse {
  readonly status: number;
  readonly headers: SimpleHeaders;
  private readonly bodyText: string;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this.status = init?.status ?? 200;
    this.headers = new SimpleHeaders(init?.headers);
    this.bodyText =
      typeof body === 'string'
        ? body
        : body == null
          ? ''
          : String(body);
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  async text() {
    return this.bodyText;
  }

  async json() {
    return JSON.parse(this.bodyText);
  }

  static json(body: unknown, init?: ResponseInit) {
    return new HttpResponse(JSON.stringify(body), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
}

export interface MockResolverArgs {
  request: MockRequest;
  params: Record<string, string>;
}

export interface MockHandler {
  method: HttpMethod;
  path: string;
  resolver: (args: MockResolverArgs) => HttpResponse | Promise<HttpResponse>;
}

function createHandler(
  method: HttpMethod,
  path: string,
  resolver: MockHandler['resolver']
): MockHandler {
  return {
    method,
    path,
    resolver,
  };
}

export const http = {
  get: (path: string, resolver: MockHandler['resolver']) =>
    createHandler('GET', path, resolver),
  post: (path: string, resolver: MockHandler['resolver']) =>
    createHandler('POST', path, resolver),
  patch: (path: string, resolver: MockHandler['resolver']) =>
    createHandler('PATCH', path, resolver),
  delete: (path: string, resolver: MockHandler['resolver']) =>
    createHandler('DELETE', path, resolver),
};

function matchPath(pattern: string, url: string) {
  const patternUrl = new URL(pattern);
  const currentUrl = new URL(url);

  if (patternUrl.origin !== currentUrl.origin) {
    return null;
  }

  const patternParts = patternUrl.pathname.split('/').filter(Boolean);
  const currentParts = currentUrl.pathname.split('/').filter(Boolean);

  if (patternParts.length !== currentParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const currentPart = currentParts[index];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(currentPart);
      continue;
    }

    if (patternPart !== currentPart) {
      return null;
    }
  }

  return params;
}

export function setupServer(...initialHandlers: MockHandler[]) {
  const originalFetch = global.fetch;
  let handlers = [...initialHandlers];

  return {
    listen() {
      global.fetch = (async (input: MockRequestInput, init?: RequestInit) => {
        const request = new MockRequest(input, init);
        const handler = handlers.find((candidate) => {
          if (candidate.method !== request.method.toUpperCase()) {
            return false;
          }

          return Boolean(matchPath(candidate.path, request.url));
        });

        if (!handler) {
          throw new Error(`Unhandled request: ${request.method} ${request.url}`);
        }

        const params = matchPath(handler.path, request.url) || {};

        return handler.resolver({
          request,
          params,
        });
      }) as unknown as typeof fetch;
    },
    resetHandlers() {
      handlers = [...initialHandlers];
    },
    use(...nextHandlers: MockHandler[]) {
      handlers = [...nextHandlers, ...handlers];
    },
    close() {
      global.fetch = originalFetch;
    },
  };
}
