import { Link } from 'react-router-dom';
import { useGetServicesMetadataQuery } from '@rootui/api/meta';

const Services = () => {
  const { data: { services } = {} } = useGetServicesMetadataQuery();

  return (
    <div className="bg-slate-900 shadow-md text-slate-300 p-4 rounded-md w-max">
      <div className="mb-2">Services</div>
      <div className="grid grid-cols-3 gap-2">
        {services?.map((service) => (
          <Link
            key={service.name}
            className="flex gap-4 p-2 rounded-md text-xs cursor-pointer hover:bg-slate-800"
            to={'/' + service.alias}
          >
            <img src={service.src} alt={service.name} className="size-10" />
            <div className="flex flex-col text-start gap-2 max-w-48">
              <span className="text-sm">{service.name}</span>
              <span className="text-xs font-light text-slate-400">
                {service.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
