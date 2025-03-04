import { EXPORT_HTML_COMMAND, TEXT_BLOCK_NODE_TYPE } from 'femails-core';
import { Layers, useFemails, useFemailsState } from 'femails-react';
import { FemailsRenderer } from 'femails-react';
import React from 'react';

const App = () => {
  const { femails } = useFemails();

  const handleCreateTextBlock = () => {
    console.log('Create Text Block');
    femails.nodes.createInstance(TEXT_BLOCK_NODE_TYPE, '');
  };

  const handleExportHtml = () => {
    const rootId = femails.nodes.root;
    const command = femails.commands.get(EXPORT_HTML_COMMAND);
    if (command && rootId) {
      const html = command.run(rootId);
      console.log('HTML:', html);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Femails Editor</h1>

      <div className="bg-gray-100 p-4 rounded">
        <p>Root Node ID: {femails.nodes.root || 'None'}</p>
      </div>

      <InstanceCount />

      <div className="flex gap-2">
        <button
          onClick={() => console.log(femails)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Print Femails
        </button>
        <button
          onClick={handleCreateTextBlock}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Text Block
        </button>
        <button
          onClick={handleExportHtml}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export HTML
        </button>
      </div>

      <div className="flex">
        <Layers />
        <FemailsRenderer />
      </div>
    </div>
  );
};

export default App;

const InstanceCount = React.memo(() => {
  const instances = useFemailsState('nodes.instances');
  return (
    <div className="bg-gray-100 p-4 rounded">
      <p>Total Nodes: {Object.keys(instances).length}</p>
    </div>
  );
});
