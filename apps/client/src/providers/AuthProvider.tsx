import { useRefreshMutation } from '../api/auth';
import { clearCredentials, setCredentials } from '../store/slices/auth';
import { createContext, useContext, useEffect } from 'react';
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

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: AuthProviderProps) {
  const [refresh, { isLoading }] = useRefreshMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    refresh({})
      .unwrap()
      .then((data) => {
        dispatch(setCredentials(data));
      })
      .catch(() => {
        dispatch(clearCredentials());
      });
  }, [dispatch, refresh]);

  const value = {
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
