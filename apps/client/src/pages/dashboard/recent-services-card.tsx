import { useRecentServiceTracker } from '@rootui/providers/recent-service-tracker';
import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { Link } from 'react-router-dom';

const RecentServicesCard = () => {
  const { data: { services } = {} } = useGetServicesMetadataQuery();
  const { history } = useRecentServiceTracker();
  const recentServices = services?.filter((service) =>
    history.includes(service.alias),
  );

  return (
    <Card>
      <CardHeader variant="muted">
        <h2 className="text-lg font-semibold">Recently visited</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {recentServices?.map((service) => (
            <Link
              key={service.alias}
              to={`/${service.alias}/home`}
              className="flex items-center text-sm gap-4"
            >
              <img src={service.src} alt={service.name} className="size-6" />
              <span className="hover:underline text-blue-600 dark:text-blue-500">
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentServicesCard;
