import { useState } from 'react';
import { useFemailsEffect } from './femails-provider';
import { EXPORT_HTML_COMMAND } from 'femails-core';

const emptyHtml = `
<html>
  <head>
    <title>Empty</title>
  </head>
  <body></body>
</html>`;

export const FemailsIFrameRenderer = () => {
  const [src, setSrc] = useState<string>(
    `data:text/html;charset=utf-8,${encodeURIComponent(emptyHtml)}`,
  );

  useFemailsEffect(
    (femails) => {
      const command = femails.commands.get(EXPORT_HTML_COMMAND);
      if (!command) return;
      const html = command.run(femails.nodes.root) + '';
      console.log('HTML:', html);
      setSrc(
        `data:text/html;charset=utf-8,${encodeURIComponent(html || emptyHtml)}`,
      );
    },
    ['nodes.instances'],
  );

  return (
    <div>
      <iframe
        src={src}
        sandbox=""
        title="Femails Renderer"
        className="w-full h-max"
      />
    </div>
  );
};
