
'use server'
import { streamObject, CoreMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { createStreamableValue } from 'ai/rsc';

import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { CodeMessageResponse, PostMessages, codeChangeSchema } from "@/lib/model";
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { storeMessage } from './projects';
import { applyCodeChanges } from '@/lib/utils';

function getSystemPrompt(mode: 'quality' | 'speed'): string {

  if (mode === 'quality') {
    return `
  
  You are an expert front-end developer using react and tailwind. You are designing components based on the users request.
  You never use any imports except for the ones you have already used in the code.
  You are using the latest version of react and tailwind and radix-ui for icons. 
  All components should be interactive and use animations when appropriate.
  All components should be responsive and should work on common screen sizes.
  All components should be accessible and should work with screen readers.
  Only use cdn links for external libraries.
  You must follow the exact format of this example. You may never respond with anything other than code. Don't format your response using markdown. The code should be executable.

  --- 
  User: Create a button that says "Click me!" and when clicked, it should display "Clicked :)".

  Answer:
  import React, { useState } from 'react';
      
  const App = () => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('Click me!');

  return (
    <div className="w-full h-[100vh] flex justify-center">
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

  `;
  } else {
    return `
  
        You are an expert front-end developer using react and tailwind. You are designing components based on the users request.
        You never use any imports except for the ones you have already used in the code.
        You are using the latest version of react and tailwind and radix-ui for icons. 
        All components should be interactive.
        All components should be responsive and should work on common screen sizes.
        All components should be accessible and should work with screen readers.
        Only use cdn links for external libraries.

        You must follow the exact format of this example. You may never respond with anything other than code. Don't format your response using markdown. The code should be executable.
      
        --- 
        User: Create a button that says "Click me!" and when clicked, it should display "Clicked :)".
      
        Answer:
        import React, { useState } from 'react';
            
        const App = () => {
        const [text, setText] = useState('Click me!');
      
        return (
          <div className="w-full h-[100vh] flex justify-center">
            <button
            className="self-center bg-indigo-600 border border-transparent rounded-md py-2 px-8 w-64 flex justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            onClick={() => {
              setText('Clicked :)');
            }}>
            <div>{text}</div>
            </button>
          </div>
          
        );
      };
      export default App;
      
        `;
  }
}
type storedResponse = {
  curr: CodeMessageResponse | null
  next: CodeMessageResponse | null
}
const getMessageFromCompletion = (completion: string): CodeMessageResponse | null => {
  const storedResponse = JSON.parse(completion) as storedResponse
  return storedResponse.curr
}
async function storeMessageCompletion(projectId: string, completion: string, messages: ChatCompletionMessageParam[], userId: string, aiOptions?: any) {
  if (!messages || messages.length === 0) {
    return
  }
  const comp = getMessageFromCompletion(completion)
  if (!comp) {
    return
  }
  storeMessage(projectId, comp, messages, userId, aiOptions.mode, aiOptions.isPrivate)
}

export async function generate(input: PostMessages) {
  const projectId = input.project.id
  const messages = input.project.messages

  const aiOptions = { mode: input.project.mode, isPrivate: input.project.isPrivate }
  const session = await getServerSession(authOptions)
  let parsedLastMessageCode = ""
  const lastAssistantMessage = messages.slice().reverse().find(message => message.role === 'assistant');
  if (lastAssistantMessage && lastAssistantMessage.content) {
    parsedLastMessageCode = JSON.parse(lastAssistantMessage.content as string).code
  }
  //console.log(parsedLastMessageCode)
  const userId = session?.user?.id
  if (!userId || !projectId) {
    return {
      error: 'Unauthorized'
    }
  }

  const systemPromptMessage = getSystemPrompt(aiOptions.mode)

  let retry = true;
  let model = aiOptions.mode === "quality" ? "gpt-4o" : "gpt-4o-mini"
  // try using the model from the mode first
  // fallback to mini if context to large, rate limited or other error
  // Implementation could create problems with storing the completion multiple times
  // and should also seperate exeptions. But for now this will do.

  while (retry) {
    try {
      const stream = createStreamableValue();
      (async () => {

        const { partialObjectStream } = await streamObject({
          model: openai(model),
          system: systemPromptMessage,
          schema: z.object({
            plan: z.string()
              .describe('A step by step of the development plan for the component. This should include a list of requirements. '),
            title: z.string(),
            description: z.string()
              .describe('A short description of the code to be executed and changes made'),
            codeChanges: codeChangeSchema,
          }),
          messages: messages as CoreMessage[],
          temperature: 0,
        });

        for await (const partialObject of partialObjectStream) {
          let fullCode = parsedLastMessageCode;
          if (partialObject.codeChanges) {
            const codeChangesWithDefaults = {
              ...partialObject.codeChanges,
              replaceAll: partialObject.codeChanges.replaceAll ?? false,
              changes: partialObject.codeChanges.changes?.filter((change): change is { oldSnippet: string; newSnippet: string; } => change !== undefined) ?? [],
            };

            fullCode = applyCodeChanges(codeChangesWithDefaults, parsedLastMessageCode);
          }
          stream.update({ ...partialObject, code: fullCode });

        }
        const completion = JSON.stringify(stream.value);
        await storeMessageCompletion(projectId, completion, messages, userId, aiOptions)
        stream.done();
      })();

      return { object: stream.value };

    } catch (error: any) {
      console.error(error)
      if (model === 'gpt-4o-mini') {
        // retry bool not needed here, but just to be explicit
        retry = false
        return {
          error: 'Unauthorized'
        }
      }
      else {
        model = 'gpt-4o-mini'
      }
    }
  }
}
