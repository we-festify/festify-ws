import { useGetServicesMetadataQuery } from '@rootui/api/meta';
import {
  useContext,
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { useLocation } from 'react-router-dom';

type RecentServiceTracker = {
  history: string[];
};

const RecentServicesKey = 'fws:recent-services';

const RecentServiceTrackerContext = createContext<RecentServiceTracker | null>(
  null,
);

const RecentServiceTrackerProvider = ({ children }: PropsWithChildren) => {
  const [history, setHistory] = useState<string[]>(() => {
    const recentServices = localStorage.getItem(RecentServicesKey);
    return recentServices ? JSON.parse(recentServices) : [];
  });
  const location = useLocation();
  const { data: { services } = {} } = useGetServicesMetadataQuery();

  useEffect(() => {
    if (services) {
      const service = services.find((service) => {
        return location.pathname.includes(service.alias);
      });
      if (service) {
        setHistory((prev) => {
          const newHistory = prev.filter((item) => item !== service.alias);
          newHistory.unshift(service.alias);
          localStorage.setItem(RecentServicesKey, JSON.stringify(newHistory));
          return newHistory;
        });
      }
    }
  }, [location, services]);

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
