
'use client'
import React, { use, useEffect, useState } from 'react';
/*
const transformCode = async (code: string) => {
  console.log('Transforming code with SWC');
  const result = await transform(code, {
    // SWC transform options for React
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
        dynamicImport: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
          useBuiltins: true,
        },
        treatConstEnumAsEnum: true,
      },
    },
  });
  return result.code;
} */

interface LivePreviewProps extends React.HTMLAttributes<HTMLIFrameElement> {
  code: string
}
const LivePreview: React.FC<LivePreviewProps> = ({ className, code, ...rest }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {

    const initCode = async () => {
      const doc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Component Preview</title>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>

      </head>
      <body>
          <div id="root"></div>
          <script>
                  ${code}
              ReactDOM.render(React.createElement(Component), document.getElementById('root'));
          </script>
      </body>
      </html>
      `
      setSrcDoc(doc);
    }
    initCode();
  }, [code]);

  return (
    <iframe
      className={className}
      srcDoc={srcDoc}
      title="preview"
      {...rest}
    />
  );
};

export default LivePreview;
