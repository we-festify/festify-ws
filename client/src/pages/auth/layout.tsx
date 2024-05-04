import { selectIsLoggedIn } from "@/store/slices/auth";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type AuthLayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: AuthLayoutProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (isLoggedIn) return <Navigate to="/" />;

  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
};

export default Layout;
