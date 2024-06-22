import { Outlet, Navigate } from 'react-router-dom';
import { selectIsLoggedIn } from '../../store/slices/auth';
import { useSelector } from 'react-redux';

const RequireLoggedIn = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return (
      <Navigate to="/a/login" state={{ from: window.location.pathname }} />
    );
  }

  return <Outlet />;
};

export default RequireLoggedIn;
