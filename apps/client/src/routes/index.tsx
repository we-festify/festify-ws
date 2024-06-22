import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './auth';
import RequireLoggedIn from './custom/RequireLoggedIn';
import DashboardRoutes from './dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="*" element={<RequireLoggedIn />}>
        <Route path="" element={<div>Home</div>} />
        <Route path="dashboard/*" element={<DashboardRoutes />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
