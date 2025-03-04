import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FemailsStateTracker } from '@femails-react/utils/femails-state-tracker';
import { IFemails } from '@femails-react/types/femails';
import { getNestedValue, NestedValue } from '@femails-react/utils/object';

type FemailsContextType = {
  tracker: FemailsStateTracker;
  femails: IFemails;
};

const FemailsContext = createContext<FemailsContextType | null>(null);

export function FemailsProvider(
  props: PropsWithChildren<{ femails: IFemails }>,
) {
  const [tracker] = useState(() => new FemailsStateTracker(props.femails));

  const value = useMemo(
    () => ({ tracker, femails: tracker.getInstance() }),
    [tracker],
  );

  return (
    <FemailsContext.Provider value={value}>
      {props.children}
    </FemailsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFemails() {
  const context = useContext(FemailsContext);
  if (!context) {
    throw new Error('useFemails must be used within a FemailsProvider');
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFemailsState<P extends string>(
  path: P,
): NestedValue<IFemails, P> {
  const { tracker } = useFemails();
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = tracker.subscribe(path, () => {
      console.log('[update]', path);
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, [tracker, path]);

  return getNestedValue(tracker.getInstance(), path);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFemailsEffect(
  effect: (femails: IFemails) => void,
  paths: string[],
) {
  const { tracker } = useFemails();

  useEffect(() => {
    const unsubscribes = paths.map((path) => {
      return tracker.subscribe(path, () => {
        effect(tracker.getInstance());
      });
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [tracker, effect, paths]);
}
