import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { FemailsProvider } from 'femails-react';
import { ExportHTMLPlugin, TEMPLATE_BLOCK_NODE_TYPE } from 'femails-core';
import { Femails, TemplateBlockPlugin, TextBlockPlugin } from 'femails-react';

// Initialize Femails instance
const femailsCore = new Femails();
femailsCore.init([
  new ExportHTMLPlugin(),
  new TemplateBlockPlugin(),
  new TextBlockPlugin(),
]);
femailsCore.nodes.createInstance(TEMPLATE_BLOCK_NODE_TYPE, '');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FemailsProvider femails={femailsCore}>
      <App />
    </FemailsProvider>
  </React.StrictMode>,
);
