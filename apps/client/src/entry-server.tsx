import React from 'react';
import ReactDOM from 'react-dom/server';
import App from '@/app';
// import './styles.css';
import './animations.css';
import './gradients.css';
import './typography.css';
import { ThemeProvider } from '@rootui/providers/theme-provider';
import { StaticRouter as Router } from 'react-router-dom/server';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@rootui/store';
import { Toaster } from '@sharedui/primitives/sonner';
import RecentServiceTrackerProvider from '../packages/rootui/src/providers/recent-service-tracker';

export function render(url: string) {
  const html = ReactDOM.renderToString(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="festify-ws-ui-theme">
          <Router location={url}>
            <RecentServiceTrackerProvider>
              <App />
            </RecentServiceTrackerProvider>
            <Toaster />
          </Router>
        </ThemeProvider>
      </ReduxProvider>
    </React.StrictMode>,
  );
  return { html };
}
