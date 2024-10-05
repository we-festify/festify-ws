import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsLoggedIn } from '@rootui/slices/auth';

type AuthLayoutProps = {
  children: JSX.Element;
};

const getFilteredFromRoute = (from: string) => {
  const excludedRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  if (excludedRoutes.includes(from)) {
    return '/';
  }

  return from || '/';
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  const from = getFilteredFromRoute(location.state?.from as string);

  if (isLoggedIn) return <Navigate to={from} />;

  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
};

export default AuthLayout;
