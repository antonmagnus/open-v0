'use client'

import React, { HTMLAttributes } from 'react';
import { IconOpenAI, IconUser } from './ui/icons';
import clsx from 'clsx';
import useAI from '@/lib/hooks/use-ai';
import { CodeMessageResponse } from '@/lib/model';
import { PromptForm } from './prompt-form';
interface ChatProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}
const tryGetDescription = (jsonString: string): string => {
  if (!jsonString || jsonString === "") {
    return ""
  }
  try {
    const message = JSON.parse(jsonString) as CodeMessageResponse
    return message.description
  } catch (e) {
    return ""
  }
}

export function Chat({ className, id }: ChatProps) {
  const { aiMessages } = useAI()
  return (
    <div className={clsx(className, "h-full overflow-y-scroll max-w-2xl")}>
      <div className={clsx("w-full h-full overflow-y-scroll max-w-2xl")}>
        <div className="mt-4 h-full p-6 space-y-4">
          {aiMessages?.map((msg, i) => (
            <div key={i} className="flex space-4">
              {msg.role === "user" ?
                <div className="flex text-accent-foreground items-center space-x-4">
                  <IconUser />
                  <p>{msg.content as string}</p>
                </div>
                :
                <div className="flex text-accent-foreground items-center space-x-4">
                  <IconOpenAI />
                  <p>{tryGetDescription(msg.content || '')}</p>
                </div>
              }
            </div>
          ))}
        </div>
      </div>
      <PromptForm className='sticky p-4 inset-x-0 bottom-0' id={id} showPrivate={false} />
    </div>
  );
};

export default Chat;
