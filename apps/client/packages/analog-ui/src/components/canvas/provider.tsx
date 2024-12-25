import useSearchParamState from '@sharedui/hooks/useSearchParamState';
import { createContext, useContext } from 'react';

interface ICanvasContext {
  activeTileId: string | undefined;
  setActiveTileId: (id: string) => void;
  clearActiveTileId: () => void;
  activeActionTab: string | undefined;
  setActiveActionTab: (tab: string) => void;
}

const CanvasContext = createContext<ICanvasContext | null>(null);

const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTileId, setActiveTileId, clearActiveTileId] =
    useSearchParamState('tile-id');
  const [activeActionTab, setActiveActionTab] =
    useSearchParamState('action-tab');

  return (
    <CanvasContext.Provider
      value={{
        activeTileId,
        setActiveTileId,
        clearActiveTileId,
        activeActionTab,
        setActiveActionTab,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
