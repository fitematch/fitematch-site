import '@testing-library/jest-dom';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

if (!URL.createObjectURL) {
  URL.createObjectURL = jest.fn(() => 'blob:mock-file');
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = jest.fn();
}

process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type TestServer = {
  listen: (options?: { onUnhandledRequest?: 'bypass' | 'error' | 'warn' }) => void;
  resetHandlers: () => void;
  close: () => void;
};

let server: TestServer | undefined;

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement> & {
    unoptimized?: boolean;
    priority?: boolean;
    fill?: boolean;
  }) => {
    const { unoptimized, priority, fill, ...imgProps } = props;
    void unoptimized;
    void priority;
    void fill;

    return React.createElement('img', {
      ...imgProps,
      alt: imgProps.alt || '',
    });
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) =>
    React.createElement(
      'a',
      {
        href,
        ...props,
      },
      children,
    ),
}));

beforeAll(async () => {
  try {
    const mswModule = (await import('@/tests/mocks/server')) as {
      server: TestServer;
    };
    server = mswModule.server;

    server.listen({
      onUnhandledRequest: 'error',
    });
  } catch {
    server = undefined;
  }
});

afterEach(() => {
  server?.resetHandlers();
  jest.clearAllMocks();
});

afterAll(() => {
  server?.close();
});
