import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./auth";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
