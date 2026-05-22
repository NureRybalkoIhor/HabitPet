import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
}

interface AuthContextType extends AuthState {
  setAuth: (token: string, userId: number, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('token'),
    userId: getStoredUserId(),
    username: localStorage.getItem('username'),
  });

  const setAuth = (token: string, userId: number, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('username', username);
    setAuthState({ token, userId, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setAuthState({ token: null, userId: null, username: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const getStoredUserId = () => {
  const userId = localStorage.getItem('userId');
  return userId ? Number(userId) : null;
};
