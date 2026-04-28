'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

type FlashMessageType = 'success' | 'error';

interface FlashMessage {
  type: FlashMessageType;
  message: string;
}

interface FlashMessageContextData {
  flashMessage: FlashMessage | null;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  closeFlashMessage: () => void;
}

const FlashMessageContext = createContext({} as FlashMessageContextData);

export function FlashMessageProvider({ children }: { children: ReactNode }) {
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);

  const closeFlashMessage = useCallback(() => {
    setFlashMessage(null);
  }, []);

  const showMessage = useCallback((type: FlashMessageType, message: string) => {
    setFlashMessage({ type, message });

    setTimeout(() => {
      setFlashMessage(null);
    }, 3000);
  }, []);

  const showSuccess = useCallback(
    (message: string) => showMessage('success', message),
    [showMessage],
  );

  const showError = useCallback(
    (message: string) => showMessage('error', message),
    [showMessage],
  );

  return (
    <FlashMessageContext.Provider
      value={{
        flashMessage,
        showSuccess,
        showError,
        closeFlashMessage,
      }}
    >
      {children}
    </FlashMessageContext.Provider>
  );
}

export function useFlashMessage() {
  return useContext(FlashMessageContext);
}
