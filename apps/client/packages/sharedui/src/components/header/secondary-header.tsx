import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import { Link } from 'react-router-dom';

const SecondaryHeader = () => {
  const { data: { services } = {} } = useGetServicesMetadataQuery();

  return (
    <div>
      <div className="bg-slate-900 text-white/90 px-3 py-1 flex justify-between items-center">
        <div className="flex-1 flex gap-4">
          {services?.map((service) => (
            <Link
              key={service.name}
              className="flex items-center gap-2 my-1 text-xs font-light cursor-pointer"
              to={'/' + service.alias}
            >
              <img src={service.src} alt={service.name} className="size-5" />
              {service.shortName}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
