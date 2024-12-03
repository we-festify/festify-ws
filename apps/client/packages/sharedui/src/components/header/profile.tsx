import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../primitives/popover';
import { ChevronDown } from 'lucide-react';
import { Separator } from '../../primitives/separator';
import { Button, buttonVariants } from '../../primitives/button';
import { useGetMeQuery, useLogoutMutation } from '@rootui/api/auth';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/error';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectIsLoggedIn } from '@rootui/store/auth';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/tw';

const Profile = () => {
  const { data: { user } = {} } = useGetMeQuery();
  const [signOut] = useLogoutMutation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  // home routes
  // /home
  // /service-id/home
  const isHomeRoute = location.pathname.split('/').includes('home');

  const handleLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut().unwrap();
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
          'min-w-24 h-8 text-slate-900 bg-white hover:bg-white/90 hover:text-slate-900',
        )}
        state={{
          from: window.location.pathname,
        }}
      >
        Sign in to console
      </Link>
    );
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1 p-2 rounded-sm text-xs cursor-pointer text-white/90 hover:bg-slate-800">
            <span>
              {user?.type === 'fws-root' ? 'Root' : user?.alias}
              <span className="text-xs text-muted-foreground pl-1">
                @ {user?.rootAccountAlias}
              </span>
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
                <span>{user?.accountId}</span>
              </div>
              <div className="flex gap-4 justify-between">
                <span>Alias</span>
                <span>
                  {user?.type === 'fws-root' ? 'Root' : user?.alias}
                  <span className="text-xs text-muted-foreground pl-1">
                    @ {user?.rootAccountAlias}
                  </span>
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
      {isLoggedIn && !isHomeRoute && (
        <Link
          to="/"
          className={cn(
            buttonVariants({
              variant: 'outline',
              size: 'sm',
            }),
            'h-8 text-slate-900 bg-white hover:bg-white/90 hover:text-slate-900',
          )}
        >
          Go to home
        </Link>
      )}
    </>
  );
};

export default Profile;
