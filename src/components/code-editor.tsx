// components/Editor.tsx
import React, { HTMLAttributes, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import useAI from '@/lib/hooks/use-ai';
import clsx from 'clsx';
import { Button } from './ui/button';
import { set } from 'zod';
import { IconSpinner } from './ui/icons';
import { time } from 'console';

interface CodeEditorProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  setCode: (value: string) => void;
  setHasUserEdited: (value: boolean) => void;
  hasUserEdited: boolean;
  codeBeforeUserEdit: string;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, className, hasUserEdited, setHasUserEdited, codeBeforeUserEdit }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Handle the editor's mount event if needed
  };
  const [loadingSave, setLoadingSave] = useState(false);
  const { updateLastResponse, isPreview } = useAI()


  const handleEditorChange = (value: any) => {
    setHasUserEdited(true);
    setCode(value || '');
  }
  const saveCode = () => {
    // Save the code to the database
    setLoadingSave(true);

    updateLastResponse(code)
    setTimeout(() => {
      setLoadingSave(false);
      setHasUserEdited(false);
    }, 250);
  }


  return (
    <div className={clsx(className, "flex flex-col w-full")}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={code}
        value={code}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        className="flex-1 rounded-sm"
        onChange={(v) => handleEditorChange(v)}

      />
      {/* code toolbar*/}
      <div className={clsx('flex flex-row space-x-4 bg-muted/50 justify-end p-4 border-r', isPreview && 'hidden')}>
        <Button className="p-2 border rounded-md"
          disabled={!hasUserEdited}
          onClick={() => setCode(codeBeforeUserEdit)}>Cancel</Button>
        <Button onClick={saveCode} className="p-2 border rounded-md"
          disabled={!hasUserEdited || loadingSave}
        >
          {loadingSave ? (
            <IconSpinner className="mr-2 animate-spin" />) :
            'Save changes'
          }
        </Button>
      </div>
    </div>
  );
};

export default CodeEditor;
