// components/Editor.tsx
import React, { HTMLAttributes, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import useAI from '@/lib/hooks/use-ai';
import { PreviewToolbar } from './preview-toolbar';
import clsx from 'clsx';
import { CodeMessageResponse } from '@/lib/model';

interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
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
  return code;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ defaultValue, onChange, className }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Handle the editor's mount event if needed
  };
  const [code, setCode] = useState(defaultValue);
  const { aiResponses, updateLastResponse } = useAI()

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
    <div className={clsx(className, "flex flex-col w-full h-full")}>
      <Editor
        height="85vh"
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        value={code}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        className="flex-1 rounded-sm"
        onChange={(v) => handleEditorChange(v)}
      />
      {/* code toolbar*/}
      <div className='flex flex-row space-x-4 bg-blue-500 justify-end p-4'>
        <button className="p-2 border bg-black text-white rounded-md">Cancel</button>
        <button onClick={saveCode} className="p-2 border bg-black text-white rounded-md">Save changes</button>
      </div>
    </div>
  );
};

export default CodeEditor;
