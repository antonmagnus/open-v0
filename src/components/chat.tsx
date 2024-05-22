'use client'

import React, { HTMLAttributes, useEffect, useState } from 'react';
import { IconUser } from './ui/icons';
import clsx from 'clsx';
import useAI from '@/lib/hooks/use-ai';
import { CodeMessageResponse } from '@/lib/model';
import { PromptForm } from './prompt-form';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { MemoizedReactMarkdown } from '@/components/markdown'

interface ChatProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  input?: string;
}
const tryGetContent = (jsonString: string): CodeMessageResponse => {
  let retMessage: CodeMessageResponse = {
    code: "",
    description: "",
    title: "",
    plan: "",
    version: "",
  }
  if (!jsonString || jsonString === "") {
    return retMessage
  }
  try {
    const message = JSON.parse(jsonString) as CodeMessageResponse
    return message
  } catch (e) {
    return retMessage
  }
}


const AssistantMessage = ({ jsonString }: { jsonString: string }) => {
  if (!jsonString) {
    return <></>
  }
  const message = JSON.parse(jsonString) as CodeMessageResponse
  const messageString = `
  ---

  ${message.title ? "### " + message.title : ""}

  ${message.description ? "###### " + message.description : ""}

  ${message.plan ? "#### Plan" : ""} 
  ${message.plan ?? ""}
  ---
  `
  return (
    <div className="flex justify-start">
      <MemoizedReactMarkdown
        className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        remarkPlugins={[remarkGfm, remarkMath]}
      >

        {messageString}
      </MemoizedReactMarkdown>
    </div>
  )
}
export function Chat({ className, id, input }: ChatProps) {
  const { project, isPreview } = useAI()
  const [prompt, setPrompt] = useState<string>(input || "")
  useEffect(() => {
    setPrompt(input || "")
  }, [input])
  return (
    <div className={clsx(className, "h-full overflow-y-scroll max-w-2xl")}>
      <div className={clsx("w-full h-full overflow-y-scroll max-w-2xl")}>
        <div className="mt-4 h-full p-6 space-y-4">
          {project.messages?.map((msg, i) => (
            <div key={i} className="flex space-4">
              {msg.role === "user" ?
                <div className="flex text-accent-foreground items-center space-x-4">
                  <IconUser className='min-w-[24px] w-[24px] max-w-[24px]' />
                  <p>{msg.content as string}</p>
                </div>
                :
                <AssistantMessage jsonString={msg.content as string} />
              }
            </div>
          ))}
        </div>
      </div>
      <PromptForm className={clsx('sticky p-4 inset-x-0 bottom-0', isPreview && 'hidden')} id={id} showPrivate={false} input={prompt} />
    </div>
  );
};

export default Chat;
