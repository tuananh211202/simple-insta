import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Khởi tạo kiểu cho trạng thái
interface AuthState {
  isLogin: boolean;
}

// Actions
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

// Actions types
type AuthAction = {
  type: string,
  payload?: {
    access_token: string,
    user: object
  }
}

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN:
      Cookies.set('accessToken', action.payload?.access_token || '');
      Cookies.set('user', JSON.stringify(action.payload?.user));
      return { ...state, isLogin: true };
    case LOGOUT:
      Cookies.remove('accessToken');
      Cookies.remove('user');
      return { ...state, isLogin: false };
    default:
      return state;
  }
};

// Khởi tạo trạng thái mặc định
const initialState: AuthState = {
  isLogin: false,
};

// Khởi tạo Context
const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | undefined>(undefined);

// Tạo Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo custom hook để sử dụng trạng thái và hàm trong component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
