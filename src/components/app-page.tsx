'use client'
import Chat from "@/components/chat";
import PreviewComponent from "@/components/preview-component";
import { PromptForm } from "@/components/prompt-form";
import { nanoid } from "ai";
import clsx from "clsx";
import useShowCoversationStore from "@/lib/hooks/useShowCoversationStore";
import { HTMLAttributes, useEffect } from "react";
import { Project } from "@/lib/model";
import useAI from "@/lib/hooks/use-ai";
interface AppPageProps extends HTMLAttributes<HTMLDivElement> {
  project?: Project
}
//export function Chat({ className, id }: ChatProps)
export default function AppPage({ className, project }: AppPageProps) {

  //const session = await auth()
  //if (!session) return <div>Not authenticated</div>

  const id = nanoid();
  const { showConversation } = useShowCoversationStore();
  const { initProject } = useAI()
  useEffect(() => {
    if (project) {
      initProject(project.aiOptions, project.messages)
    } else {
      initProject({
        id,
        mode: 'speed',
        isPrivate: false,
      }, [])
    }
  }, [project])
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
          <PromptForm className={clsx("bg-muted/50 border backdrop-blur-xl bg-opacity-70 absolute p-4 bottom-4 left-1/2 transform -translate-x-1/2 md:w-[50%] sm:w-[70%] w-full rounded-xl ", showConversation && "hidden")} id={id} showPrivate={false} />
        </div>
      </div>
    </div>
  );
}
