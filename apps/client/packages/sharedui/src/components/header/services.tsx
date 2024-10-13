import { useNavigate } from 'react-router-dom';
import { ServiceMetaType, services } from '../../constants/services';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@rootui/store/auth';

const Services = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleServiceClick = (service: ServiceMetaType) => {
    if (!service.docsPath || !service.homePath) return;
    if (isLoggedIn) {
      navigate(service.homePath);
    } else {
      navigate(service.docsPath);
    }
  };

  return (
    <div className="bg-slate-900 shadow-md text-slate-300 p-4 rounded-md w-max">
      <div className="mb-2">Services</div>
      <div className="grid grid-cols-3 gap-2">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex gap-4 p-2 rounded-md text-xs cursor-pointer hover:bg-slate-800"
            onClick={() => handleServiceClick(service)}
            role="button"
          >
            <img src={service.src} alt={service.name} className="size-10" />
            <div className="flex flex-col gap-2 max-w-48">
              <span className="text-sm">{service.name}</span>
              <span className="text-xs font-light text-slate-400">
                {service.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
