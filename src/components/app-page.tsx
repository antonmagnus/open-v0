'use client'
import Chat from "@/components/chat";
import PreviewComponent from "@/components/preview-component";
import { PromptForm } from "@/components/prompt-form";
import { nanoid } from "ai";
import clsx from "clsx";
import useShowCoversationStore from "@/lib/hooks/useShowCoversationStore";
import { HTMLAttributes, useEffect, useState } from "react";
import { Project } from "@/lib/model";
import useAI from "@/lib/hooks/use-ai";
import { EmptyScreen } from "./empty-screen";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";
interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  project?: Project,
  preview: boolean
}
//export function Chat({ className, id }: ChatProps)
export default function AppPage({ className, project, preview }: AppPageProps) {

  //const session = await auth()
  //if (!session) return <div>Not authenticated</div>

  const id = nanoid();
  const { showConversation } = useShowCoversationStore();
  const { initProject, aiResponses } = useAI()
  const [input, setInput] = useState<string>("")
  useEffect(() => {
    if (project) {
      initProject(project, preview)
    } else {
      const session = getSession()
      session.then((session) => {
        if (!session?.user.id) {
          toast.error("Not authenticated")
          return
        }
        initProject({
          id: id,
          title: 'Untitled',
          description: '',
          messages: [],
          userId: session?.user?.id,
          createdAt: new Date(),
          path: `/project/${id}`,
          mode: 'speed',
          isPrivate: false,
        }, preview)
      })
    }
  }, [project])
  if (aiResponses && aiResponses.length > 0) {
    return (
      <div className="w-full h-full justify-center">
        <div className="h-full flex flex-shrink-0 flex-row-reverse w-full">
          <div className={clsx("md:w-1/3 w-full  bg-muted", !showConversation && "hidden")}>
            <Chat className="" id={id} />
          </div>
          <div className={clsx("relative w-full h-full", showConversation && "md:block hidden")}>
            <PreviewComponent className="h-full" id={id} />

            {/* <div className="m-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-200 w-[50%] h-32 rounded">
            test
          </div>  */}
            <PromptForm className={clsx("bg-muted/50 border backdrop-blur-xl bg-opacity-70 sm:absolute p-4 bottom-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 md:w-[50%] sm:w-[70%] w-full rounded-xl ", (showConversation || preview) && "hidden")} id={id} showPrivate={false} />
          </div>
        </div>
      </div>)
  }
  return (
    <div className="w-full h-full justify-center">
      <div className="h-full flex flex-shrink-0 flex-row-reverse w-full">
        <div className={clsx("md:w-1/3 w-full  bg-muted", !showConversation && "hidden")}>
          <Chat className="" id={id} input={input} />
        </div>
        <div className={clsx("relative w-full h-full items-center ", showConversation && "md:block hidden")}>
          <EmptyScreen setInput={setInput} />
          {/* <div className="m-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-200 w-[50%] h-32 rounded">
            test
          </div>  */}
          <PromptForm className={clsx("bg-muted/50 border backdrop-blur-xl bg-opacity-70 sm:absolute p-4 bottom-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 md:w-[50%] sm:w-[70%] w-full rounded-xl ", (showConversation || preview) && "hidden")} id={id} showPrivate={false} input={input} />
        </div>
      </div>
    </div>
  );
}
