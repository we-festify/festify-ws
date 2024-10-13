import { useGetMeQuery } from '../api/auth';
import { clearCredentials } from '../store/auth';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  isLoading: boolean;
};

const initialState: AuthProviderState = {
  isLoading: true,
};

const AuthContext = createContext<AuthProviderState>(initialState);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const { data, isLoading } = useGetMeQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      dispatch(clearCredentials());
    }
  }, [data, dispatch]);

  const value = useMemo(() => ({ isLoading }), [isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? 'Loading...' : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
