// components/Editor.tsx
import React, { HTMLAttributes, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import useAI from '@/lib/hooks/use-ai';
import clsx from 'clsx';
import { Button } from './ui/button';

interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  onChange: (value: any) => void;
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
const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, className, defaultValue }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Handle the editor's mount event if needed
  };
  const [code, setCode] = useState(defaultValue || '');
  const { aiResponses, updateLastResponse, isPreview } = useAI()

  const handleEditorChange = (value: any) => {
    setCode(value || '');
    onChange(value);
  }
  const saveCode = () => {
    // Save the code to the database
    updateLastResponse(code)
  }

  useEffect(() => {
    if (aiResponses && aiResponses.length > 0) {
      const lastMessage = aiResponses[aiResponses.length - 1]
      const formattedCode = formatJSXCode(lastMessage.code);
      setCode(formattedCode)
      handleEditorChange(formattedCode)
    }
  }, [aiResponses])

  return (
    <div className={clsx(className, "flex flex-col w-full")}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        value={code}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        className="flex-1 rounded-sm"
        onChange={(v) => handleEditorChange(v)}

      />
      {/* code toolbar*/}
      <div className={clsx('flex flex-row space-x-4 bg-muted/50 justify-end p-4 border-r', isPreview && 'hidden')}>
        <Button className="p-2 border rounded-md">Cancel</Button>
        <Button onClick={saveCode} className="p-2 border rounded-md">Save changes</Button>
      </div>
    </div>
  );
};

export default CodeEditor;
