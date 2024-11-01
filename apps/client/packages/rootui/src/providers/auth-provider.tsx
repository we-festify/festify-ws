import { useGetMeQuery } from '../api/auth';
import { clearCredentials } from '../store/auth';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  isLoading: boolean;
  user: {
    alias: string;
    accountId: string;
    type: string;
    rootAccountAlias: string;
  } | null;
};

const initialState: AuthProviderState = {
  isLoading: true,
  user: null,
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

  const value = useMemo(
    () => ({ isLoading, user: data?.user ?? null }),
    [isLoading, data],
  );

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? 'Loading...' : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
