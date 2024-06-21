import Logo from '@client/components/custom/Logo';
import { SidebarNav } from '@client/components/dashboard/SidebarNav';

const sidebarNavItems = [
  {
    title: 'Home',
    href: '/dashboard',
  },
  {
    title: 'Services',
    href: '/dashboard/services/*',
  },
  {
    title: 'Account',
    href: '/dashboard/account',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <div className="hidden space-y-6 md:block">
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <div className="flex flex-col text-center h-screen gap-4 justify-center md:hidden">
        <Logo className="text-2xl" />
        <p className="text-sm text-opacity-50">
          This dashboard is not optimized for mobile devices.
        </p>
      </div>
    </>
  );
};

export default DashboardLayout;
