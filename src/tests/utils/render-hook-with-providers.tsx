import { ReactNode } from 'react';
import { renderHook, RenderHookOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/auth-context';
import { FlashMessageProvider } from '@/contexts/flash-message-context';

function Providers({ children }: { children: ReactNode }) {
  return (
    <FlashMessageProvider>
      <AuthProvider>{children}</AuthProvider>
    </FlashMessageProvider>
  );
}

export function renderHookWithProviders<Result, Props>(
  renderCallback: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>
) {
  return renderHook(renderCallback, {
    wrapper: Providers,
    ...options,
  });
}
