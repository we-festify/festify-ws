import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';
import { Toaster } from '@client/components/ui/sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="festify-ws-ui-theme">
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>
);
