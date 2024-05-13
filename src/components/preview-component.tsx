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


// should replace this component with a hook similar to useChat.
// avoid prop drilling this
interface PreviewProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  defaultCode: string;
}


const PreviewComponent: React.FC<PreviewProps> = ({ className, defaultCode, id }) => {
  const [editorValue, setEditorValue] = useState(defaultCode);
  const [previewCode, setPreviewCode] = useState('');
  const [showCode, setShowCode] = useState(true);

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


  useDelayEffect(async () => {
    if (!editorValue || !editorValue.trim())
      return;

    try {
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

  }, [editorValue], 1000);

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
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
        >

          <LivePreview className="w-full border-r-2 border-green-900 pr-2 rounded-sm" code={previewCode || ''} />
          {showCode && <CodeEditor className={clsx(!showCode && "hidden")} defaultValue={editorValue} onChange={(v: any) => setEditorValue(v || '')} />}
        </Split>

        : <LivePreview className="w-full h-full p-2 rounded-sm" code={previewCode || ''} />
      }

    </div>

  );
};

export default PreviewComponent;
