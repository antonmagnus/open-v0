import Chat from "@/components/chat";
import PreviewComponent from "@/components/preview-component";
import { PromptForm } from "@/components/prompt-form";
import { nanoid } from "ai";
import Split from 'react-split';



export default function Home() {
  const id = nanoid();

  return (
    <main className="flex flex-row h-screen w-full bg-gray-200 justify-center">
      {/*  */}
      <div className="w-1/3 h-full bg-slate-800">
        <PromptForm className="h-full" id={id} showPrivate={false} />
      </div>
      <div className="w-2/3 h-full">
        <PreviewComponent className="h-full" id={id} defaultCode={`
      import React, { useState } from 'react';

      const App = () => {
      const [loading, setLoading] = useState(false);
      const [text, setText] = useState('Click me!');

      return (
        <div className="w-full h-[100vh] bg-blue-200 flex justify-center">
          <button
          className="disabled:opacity-50 self-center bg-indigo-600 border border-transparent rounded-md py-2 px-8 w-64 flex justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setText('Clicked :)');
              setLoading(false);
            }, 1000);
          }}
          disabled={loading}>
          {loading ? (
                  <div className="flex flex-row">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  </div>
          ) : (<div>{text}</div>)

          }
          </button>
        </div>
        
      );
      };
      export default App;

      `} />
      </div>
    </main>
  );
}
