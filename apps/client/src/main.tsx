import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/entry';
import './styles.css';
import './animations.css';
import './gradients.css';
import './typography.css';
import { ThemeProvider } from '@rootui/providers/theme-provider';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@rootui/store';
import { Toaster } from '@sharedui/primitives/sonner';

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
  </React.StrictMode>,
);
