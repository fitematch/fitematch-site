'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthService } from '@/services/auth/auth.service';
import {
  AuthUser,
  SignInRequest,
  SignInResponse,
  UpdateMeRequest,
} from '@/services/auth/auth.types';
import { TokenStorage } from '@/services/http/token-storage';

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (payload: SignInRequest) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
  updateMe: (payload: UpdateMeRequest) => Promise<AuthUser>;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshMe = useCallback(async () => {
    try {
      const me = await AuthService.me();
      setUser(me);
    } catch {
      TokenStorage.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (payload: SignInRequest) => {
    const response = await AuthService.signIn(payload);
    setUser(response.user);

    return response;
  }, []);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
  }, []);

  const updateMe = useCallback(async (payload: UpdateMeRequest) => {
    const updatedUser = await AuthService.updateMe(payload);
    setUser(updatedUser);

    return updatedUser;
  }, []);

  useEffect(() => {
    const hasStoredToken = TokenStorage.getAccessToken() !== null;

    if (!hasStoredToken) {
      return;
    }

    let isActive = true;

    const loadMe = async () => {
      if (isActive) {
        setIsLoading(true);
      }

      try {
        const me = await AuthService.me();

        if (isActive) {
          setUser(me);
        }
      } catch {
        TokenStorage.clearTokens();

        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadMe();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
      refreshMe,
      updateMe,
    }),
    [user, isLoading, signIn, signOut, refreshMe, updateMe],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
