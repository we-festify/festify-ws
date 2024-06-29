import Home from '../components/dashboard/home';
import Services from '../pages/dashboard/services';
import DashboardLayout from '../pages/dashboard/layout';
import { Route, Routes } from 'react-router-dom';
import Account from '../components/dashboard/account';
import BESRoutes from '../packages/bes/routes';

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="services/*">
          <Route path="" element={<Services />} />
          <Route path="bes/*" element={<BESRoutes />} />
        </Route>
        <Route path="account" element={<Account />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
