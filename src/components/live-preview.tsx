
'use client'
import clsx from 'clsx';
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
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">

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
  loading: boolean
  device: 'mobile' | 'desktop' | 'tablet'
}
const LivePreview: React.FC<LivePreviewProps> = ({ className, loading, code, device, ...rest }) => {
  const [srcDoc, setSrcDoc] = useState('');

  const frameWidth = device === 'mobile' ? 'w-full sm:w-[375px]' : device === 'tablet' ? 'w-full sm:w-[768px]' : 'w-full'

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
          <script src="https://cdn.jsdelivr.net/npm/radix-ui@1.0.1/index.min.js"></script>
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
    <div
      className={clsx(className, "relative h-full w-full flex items-center justify-center")}
    >
      <div className={clsx('absolute flex bg-white bg-opacity-20 bg-black h-full w-full items-center justify-center', !loading && 'hidden')}>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 bg-opacity-20 bg-black backdrop-blur-sm border-8 border-white border-opacity-50 border-t-transparent"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <span className="text-white-500 text-xl font-semibold">Loading...</span>
          </div>
        </div>
      </div>
      <iframe
        className={clsx("h-full border border-foreground", frameWidth)}
        srcDoc={srcDoc}
        title="preview"
        {...rest}
      />
    </div>
  )
};

export default LivePreview;
