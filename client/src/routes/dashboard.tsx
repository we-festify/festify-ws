import { Route, Routes } from "react-router-dom";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<div>Dashboard</div>} />
    </Routes>
  );
};

export default DashboardRoutes;
