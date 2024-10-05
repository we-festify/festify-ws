import AuthProvider from '@rootui/providers/AuthProvider';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
