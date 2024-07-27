import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { ChevronDown } from 'lucide-react';
import { Separator } from '../../ui/separator';
import { Button, buttonVariants } from '../../ui/button';
import { useGetMeQuery, useLogoutMutation } from '../../../../api/auth';
import { AccountType } from '@shared/types/account';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/error';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCredentials,
  selectIsLoggedIn,
} from '../../../../store/slices/auth';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../../lib/utils';

const Profile = () => {
  const { data: { account } = {} } = useGetMeQuery<{
    data: { account: AccountType };
  }>({});
  const [signOut] = useLogoutMutation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  const isHomeRoute = location.pathname.split(/.*\//)[1] === 'home';

  const handleLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut({}).unwrap();
      dispatch(clearCredentials());
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!isLoggedIn) {
    return (
      <Link
        to="/a/login"
        className={cn(
          buttonVariants({
            variant: 'outline',
            size: 'sm',
          }),
          'w-24 h-8'
        )}
        state={{
          from: window.location.pathname,
        }}
      >
        Sign in
      </Link>
    );
  }

  if (isLoggedIn && !isHomeRoute) {
    const currentPath = location.pathname;
    const link = currentPath.split('/').slice(0, 2).join('/') + '/home';

    return (
      <Link
        to={link}
        className={cn(
          buttonVariants({
            variant: 'outline',
            size: 'sm',
          }),
          'h-8 text-primary'
        )}
      >
        Go to console
      </Link>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 p-2 rounded-sm text-xs cursor-pointer text-white/90 hover:bg-slate-800">
          <span>
            {account?.alias}
            {account?.type !== 'root' &&
              typeof account?.rootAccount !== 'string' && (
                <span className="text-xs text-muted-foreground pl-1">
                  @ {account?.rootAccount.alias}
                </span>
              )}
          </span>
          <ChevronDown size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 px-2 shadow-none rounded-none ring-0 border-0 bg-transparent max-w-none">
        <div className="bg-slate-900 text-slate-200 shadow-md text-muted p-4 rounded-md w-max min-w-64">
          <div className="mb-3 text-sm text-slate-400">Profile</div>
          <div className="flex flex-col gap-3 text-xs text-end">
            <div className="flex gap-4 justify-between">
              <span>Account Id</span>
              <span>{account?._id}</span>
            </div>
            <div className="flex gap-4 justify-between">
              <span>Alias</span>
              <span>
                {account?.alias}
                {account?.type !== 'root' &&
                  typeof account?.rootAccount !== 'string' && (
                    <span className="text-xs text-muted-foreground pl-1">
                      @ {account?.rootAccount.alias}
                    </span>
                  )}
              </span>
            </div>
            <Separator className="bg-slate-600 mt-4 mb-2" />
            <Button variant="secondary" size="sm" onClick={handleLogOut}>
              Sign out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
