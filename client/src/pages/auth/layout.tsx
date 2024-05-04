import { selectIsLoggedIn } from "@/store/slices/auth";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

type AuthLayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: AuthLayoutProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  const from = location.state?.from || "/";

  if (isLoggedIn) return <Navigate to={from} />;

  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
};

export default Layout;
