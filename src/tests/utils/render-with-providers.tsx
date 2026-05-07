import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/auth-context';
import { FlashMessageProvider } from '@/contexts/flash-message-context';

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <FlashMessageProvider>
      <AuthProvider>{children}</AuthProvider>
    </FlashMessageProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: Providers,
    ...options,
  });
}
