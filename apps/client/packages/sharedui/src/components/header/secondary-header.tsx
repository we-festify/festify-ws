import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import { getErrorMessage } from '@sharedui/utils/error';
import { TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecondaryHeader = () => {
  const {
    data: { services } = {},
    error,
    isError,
    isFetching,
    refetch,
  } = useGetServicesMetadataQuery();

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
    </div>
  );
};

export default SecondaryHeader;
