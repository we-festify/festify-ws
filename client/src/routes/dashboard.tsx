import Home from "@/components/dashboard/home";
import Services from "@/pages/dashboard/services";
import DashboardLayout from "@/pages/dashboard/layout";
import { Route, Routes } from "react-router-dom";
import BESService from "@/pages/dashboard/services/bes";
import TSService from "@/pages/dashboard/services/ts";
import Account from "@/components/dashboard/account";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="services/*">
          <Route path="" element={<Services />} />
          <Route path="bes" element={<BESService />} />
          <Route path="ts" element={<TSService />} />
        </Route>
        <Route path="account" element={<Account />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
