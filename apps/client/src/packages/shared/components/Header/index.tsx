import { CircleHelp, Grip } from 'lucide-react';
import Logo from '../ui/Logo';
import HeaderSearchBar from './SearchBar';
import SecondaryHeader from './SecondaryHeader';

import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import Services from './Services';
import Settings from './Settings';
import Profile from './Profile';

const Header = () => {
  return (
    <div className="sticky top-0 left-0 z-50">
      <div className="bg-slate-900 text-white/90 px-3 py-1 flex justify-between items-center">
        <div className="flex-1 flex gap-4">
          <Logo variant="light" size="sm" />
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-sm text-xs cursor-pointer text-white/90 hover:bg-slate-800">
                <Grip size={16} />
                <span>Services</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 px-2 shadow-none rounded-none ring-0 border-0 bg-transparent max-w-none">
              <Services />
            </PopoverContent>
          </Popover>
          <HeaderSearchBar />
        </div>
        <div className="flex gap-4">
          <Settings />
          <div className="flex items-center gap-2 p-2 rounded-sm text-xs cursor-pointer text-white/90 hover:bg-slate-800">
            <CircleHelp size={16} />
            <span>Help</span>
          </div>
          <Profile />
        </div>
      </div>
      <SecondaryHeader />
    </div>
  );
};

export default Header;
