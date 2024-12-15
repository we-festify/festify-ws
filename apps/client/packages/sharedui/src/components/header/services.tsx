import { Link } from 'react-router-dom';
import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import { TriangleAlert } from 'lucide-react';
import { getErrorMessage } from '@sharedui/utils/error';

const Services = () => {
  const {
    data: { services } = {},
    error,
    isError,
    isFetching,
    refetch,
  } = useGetServicesMetadataQuery();

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
        {isFetching && <div className="text-sm my-1">Loading...</div>}
        {isError && (
          <div className="text-destructive flex items-center gap-2 my-1">
            <TriangleAlert className="size-5" />
            <span className="text-sm">
              {getErrorMessage(error)} -{' '}
              <span
                className="hover:underline cursor-pointer"
                onClick={refetch}
              >
                Reload
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
