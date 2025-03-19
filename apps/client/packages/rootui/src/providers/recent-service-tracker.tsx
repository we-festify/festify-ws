import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import { useLocalStorage } from '@sharedui/hooks/useLocalStorage';
import { useContext, createContext, useEffect, PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

type RecentServiceTracker = {
  history: string[];
};

const RecentServicesKey = 'fws:recent-services';

const RecentServiceTrackerContext = createContext<RecentServiceTracker | null>(
  null,
);

const RecentServiceTrackerProvider = ({ children }: PropsWithChildren) => {
  const [history, setHistory] = useLocalStorage<string[]>(
    RecentServicesKey,
    [],
  );
  const location = useLocation();
  const { data: { services } = {} } = useGetServicesMetadataQuery();

  useEffect(() => {
    if (services) {
      const service = services.find((service) => {
        return location.pathname.includes(service.alias);
      });
      if (service) {
        setHistory((prev) => {
          return prev
            .filter((item) => item !== service.alias)
            .concat(service.alias)
            .slice(-5);
        });
      }
    }
  }, [location, services, setHistory]);

  return (
    <RecentServiceTrackerContext.Provider value={{ history }}>
      {children}
    </RecentServiceTrackerContext.Provider>
  );
};

export default RecentServiceTrackerProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useRecentServiceTracker = () => {
  const context = useContext(RecentServiceTrackerContext);
  if (!context) {
    throw new Error(
      'useRecentServiceTracker must be used within a RecentServiceTrackerProvider',
    );
  }
  return context;
};
