import AuthProvider from '@rootui/providers/auth-provider';
import AppRoutes from './routes';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

function App() {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <AppRoutes />
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
