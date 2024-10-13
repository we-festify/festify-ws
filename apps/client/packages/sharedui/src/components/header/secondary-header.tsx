import { useNavigate } from 'react-router-dom';
import { ServiceMetaType, services } from '../../constants/services';

const SecondaryHeader = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service: ServiceMetaType) => {
    if (!service.docsPath || !service.homePath) return;
    if (service.homePath) {
      navigate(service.homePath);
    } else {
      navigate(service.docsPath);
    }
  };

  return (
    <div>
      <div className="bg-slate-900 text-white/90 px-3 py-1 flex justify-between items-center">
        <div className="flex-1 flex gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center gap-2 my-1 text-xs font-light cursor-pointer"
              onClick={() => handleServiceClick(service)}
              role="button"
            >
              <img src={service.src} alt={service.name} className="size-5" />
              {service.shortName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
