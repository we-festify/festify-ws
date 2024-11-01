import { useNavigate } from 'react-router-dom';
import { IServiceMeta, services } from '../../constants/services';

const SecondaryHeader = () => {
  const navigate = useNavigate();

  const handleServiceClick = (service: IServiceMeta) => {
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
            <button
              key={service.name}
              className="flex items-center gap-2 my-1 text-xs font-light cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <img src={service.src} alt={service.name} className="size-5" />
              {service.shortName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
