import Home from '@client/components/dashboard/home';
import Services from '@client/pages/dashboard/services';
import DashboardLayout from '@client/pages/dashboard/layout';
import { Route, Routes } from 'react-router-dom';
import BESService from '@client/pages/dashboard/services/bes';
import TSService from '@client/pages/dashboard/services/ts';
import Account from '@client/components/dashboard/account';
import Instances from '@client/pages/dashboard/services/instances';

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="services/*">
          <Route path="" element={<Services />} />
          <Route path="bes" element={<BESService />} />
          <Route path="ts" element={<TSService />} />
          <Route path=":type/instances/:instanceId/*" element={<Instances />} />
        </Route>
        <Route path="account" element={<Account />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
