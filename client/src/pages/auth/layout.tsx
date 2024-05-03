type AuthLayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
};

export default Layout;
