import { createContext, useState } from 'react';

// 1. Keep this local to the file (remove the 'export' keyword)
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('task_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('task_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData, userToken) => {
    localStorage.setItem('task_token', userToken);
    localStorage.setItem('task_user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('task_token');
    localStorage.removeItem('task_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. Export the Context object as the default export at the bottom.
// This satisfies Vite's linting rules perfectly.
export default AuthContext;