'use client'
import React, { useState, HTMLAttributes, useEffect } from 'react';
import Split from 'react-split';
import LivePreview from '@/components/live-preview';
import useDelayEffect from '@/lib/hooks/useDelayEffect';
import CodeEditor from '@/components/code-editor';
import { PromptForm } from './prompt-form';
import { useChat, type Message } from 'ai/react'
import { toast } from 'react-hot-toast'
import clsx from 'clsx';
import useAI from '@/lib/hooks/use-ai';
import { PreviewToolbar } from './preview-toolbar';
import { useScreenSize } from '@/lib/hooks/use-screensize';


// should replace this component with a hook similar to useChat.
// avoid prop drilling this
interface PreviewProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  defaultCode?: string;
}

function formatJSXCode(code: string) {
  if (!code) return code;
  // Replace escaped newlines within strings
  code = code.replace(/\\n/g, '\n');

  // Handle the JSX specific attribute formatting
  code = code.replace(/<([a-z]+)([^>]*)\\>/gi, (match, tagName, attributes) => {
    // Normalize attribute strings
    attributes = attributes.replace(/"\n\s*/g, '" ').replace(/\s*\n\s*/g, ' ');
    return `<${tagName}${attributes}>`;
  });

  // Replace escaped double quotes
  code = code.replace(/\\"/g, '"');

  // Replace escaped backslashes
  code = code.replace(/\\$/gm, '');

  // Remove invalid comments
  code = code.replaceAll(/<!--[\s\S]*?-->/g, '')
  return code;
}

const PreviewComponent: React.FC<PreviewProps> = ({ className, defaultCode, id }) => {
  const [editorValue, setEditorValue] = useState(defaultCode);
  const [previewCode, setPreviewCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const { screenSize, loading } = useScreenSize();
  const [allowSplit, setAllowSplit] = useState(true);
  const { aiResponses, isStreaming, setIsStreaming } = useAI();
  const toggleCode = () => {
    console.log("Toggle code")
    setShowCode(!showCode);
  }
  const shareCode = () => {
    console.log("Share code")
  }
  const copyCode = () => {
    console.log("Copy code")
  }
  const saveCode = () => {
    console.log("Save code")
  }

  useEffect(() => {
    if (aiResponses && aiResponses.length > 0) {
      const lastMessage = aiResponses[aiResponses.length - 1]
      const formattedCode = formatJSXCode(lastMessage.code);
      setEditorValue(formattedCode)
    }
  }, [aiResponses])

  useEffect(() => {
    if (loading) return;
    if (screenSize.width < 640) {
      setAllowSplit(false);
    } else {
      setAllowSplit(true);
    }
  }, [screenSize.width, screenSize.height, loading])

  useDelayEffect(async () => {
    if (!editorValue || !editorValue.trim())
      return;

    try {
      setIsStreaming(true);
      const res = await fetch('https://rollups-b3tslor6ta-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: editorValue })
      });
      const { code } = await res.json();
      setPreviewCode(code);
    }
    catch (err: any) {
      console.error('Error fetching preview code:', err);
    }
    finally {
      setIsStreaming(false);
    }

  }, [editorValue], 1000);


  if (allowSplit) {
    return (
      <div className={clsx(className, "flex flex-col h-full w-full")}>
        <PreviewToolbar toggleCode={toggleCode} shareCode={shareCode} copyCode={copyCode} saveCode={saveCode} />
        {showCode ?
          <Split className={clsx("flex w-full h-full")}
            sizes={[50, 50]}
            minSize={250}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            gutterStyle={(dimension, gutterSize) => ({
              'flex-basis': `${gutterSize}px`,
              'cursor': 'col-resize',
              ':hover': {
                'background': 'cornflowerblue'
              }
            })}
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
          >

            <LivePreview className="w-full rounded-sm" code={previewCode || ''} loading={isStreaming} />
            {showCode && <CodeEditor className={clsx(!showCode && "hidden")} code={editorValue || ''} setCode={(v: any) => setEditorValue(v || '')} />}
          </Split>

          : <LivePreview className="w-full h-full p-2 rounded-sm" code={previewCode || ''} loading={isStreaming} />
        }

      </div>

    );
  }
  else {
    return (
      <div className={clsx(className, "flex flex-col h-full w-screen")}>
        <PreviewToolbar toggleCode={toggleCode} shareCode={shareCode} copyCode={copyCode} saveCode={saveCode} />
        {showCode ?
          <CodeEditor className="h-full w-full" code={editorValue || ''} setCode={(v: any) => setEditorValue(v || '')} />
          : <LivePreview className="w-full h-full p-2 rounded-sm" code={previewCode || ''} loading={isStreaming} />
        }
      </div >
    )
  }
};

export default PreviewComponent;
