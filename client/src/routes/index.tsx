import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./auth";
import RequireLoggedIn from "./custom/RequireLoggedIn";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="*" element={<RequireLoggedIn />}>
        <Route path="" element={<div>Hello World, You're logged in</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
