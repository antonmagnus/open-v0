
'use server'
import { streamObject, CoreMessage, CoreSystemMessage, OpenAIStream, nanoid } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { createStreamableValue } from 'ai/rsc';

import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { PostMessages } from "@/lib/model";
import { kv } from '@vercel/kv';
import { auth } from '@/auth';

type systemPromptReq = {
  messages: ChatCompletionMessageParam[]
}
async function getSystemPrompt(messages: systemPromptReq): Promise<string> {
  //only answer in an executable react component (no markdown and no imports other than from 'react') styled using tailwind, default export should be export default App
  return `
  
  You are an expert front-end developer using react and tailwind. You are designing components based on the users request.
  You never use any imports except for the ones you have already used in the code. You are using the latest version of react and tailwind. You must follow the exact format of this example. You mamy never respond with anything other than code. Don't format your response using markdown. The code should be executable.
  
  --- 
  User: Create a button that says "Click me!" and when clicked, it should display "Clicked :)".

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

  `;
}
async function storeMessageCompletion(chatId: string, completion: string, messages: any[], userId: string) {
  'use server'
  const title = messages[0].content.substring(0, 100)
  const id = chatId ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: completion,
        role: 'assistant'
      }
    ]
  }
  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${userId}`, {
    score: createdAt,
    member: `chat:${id}`
  })
}
const getSession = async () => {
  const session = await auth()
  return session
}
export async function generate(input: PostMessages) {
  'use server'
  const chatId = input.id
  const messages = input.messages
  let systemPromptMessage: string
  // const session = await getSession()
  // console.log('session', session)
  // const userId = session?.user?.id
  // if (!userId || !chatId) {
  //   console.log('userid', userId, 'chatid', chatId)
  //   return {
  //     error: 'Unauthorized'
  //   }
  // }

  try {
    systemPromptMessage = await getSystemPrompt({
      messages
    })
  }
  catch (error: any) {
    console.error(error)
    return {
      error: 'Unauthorized'
    }
  }
  let retry = true;
  let model = "gpt-4o"
  // try using gpt 4 first, if it fails (can be context window or rate limit), fallback to gpt 3.5
  // the open ai and the stream response should be seperate try catch blocks and not while loop
  // now the storage can happen twice but im tiered and i dont want to think about it
  while (retry) {
    try {
      const stream = createStreamableValue();
      (async () => {

        const { partialObjectStream } = await streamObject({
          model: openai(model),
          system: systemPromptMessage,
          schema: z.object({
            description: z.string()
              .describe('A short description of the code to be executed and changes made'),
            code: z
              .string()
              .describe('The full code to be executed.'),
          }),
          messages: messages as CoreMessage[],
          temperature: 0,
        });

        for await (const partialObject of partialObjectStream) {
          stream.update(partialObject);
        }

        //const completion = JSON.stringify(stream.value);
        //await storeMessageCompletion(chatId, completion, messages, userId)
        stream.done();
      })();

      return { object: stream.value };

    } catch (error: any) {
      console.error(error)
      if (model === 'gpt-3.5-turbo-16k') {
        // retry bool not needed here, but just to be explicit
        retry = false
        return {
          error: 'Unauthorized'
        }
      }
      else {
        model = 'gpt-3.5-turbo-16k'
      }
    }
  }
}
