import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../primitives/popover';
import { ServiceMetaType, services } from '../../constants/services';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@rootui/slices/auth';

const HeaderSearchBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([...services]);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!query) {
      setOpen(false);
      return setFilteredServices([...services]);
    }
    const filtered = services.filter(({ name }) =>
      name.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
    setOpen(filtered.length > 0);
  }, [query]);

  const handleServiceClick = (service: ServiceMetaType) => {
    if (!service.docsPath || !service.homePath) return;
    if (isLoggedIn) {
      navigate(service.homePath);
    } else {
      navigate(service.docsPath);
    }
  };

  return (
    <Popover open={open}>
      <PopoverTrigger className="flex-1 w-full max-w-96">
        <div className="flex-1 relative w-full text-slate-300">
          <Search size={14} className="absolute left-2 top-2" />
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for services"
            className="w-full bg-slate-800 p-2 pl-8 rounded-sm text-xs active:outline-none focus:outline-none"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 px-2 shadow-none rounded-none ring-0 border-0 bg-transparent max-w-none">
        <div className="bg-slate-900 shadow-md text-slate-300 p-4 rounded-md w-max">
          <div className="grid gap-2">
            {filteredServices.map((service) => (
              <div
                key={service.name}
                className="flex gap-3 p-2 items-center rounded-sm text-xs cursor-pointer hover:bg-slate-800"
                onClick={() => handleServiceClick(service)}
                role="button"
              >
                <img src={service.src} alt={service.name} className="size-5" />
                <span className="text-sm">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderSearchBar;
