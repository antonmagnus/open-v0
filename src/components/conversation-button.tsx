'use client'
import useAI from "@/lib/hooks/use-ai"
import useShowCoversationStore from "@/lib/hooks/useShowCoversationStore"
import clsx from "clsx"
import { HTMLAttributes } from "react"


const ShowCoversationButton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  const { showConversation, setShowConversation } = useShowCoversationStore()
  const { isPreview } = useAI()
  return (
    <div className={clsx(className, "flex flex-row items-center space-x-4", isPreview && 'hidden')}>
      <button className="" onClick={() => setShowConversation(!showConversation)}>
        {showConversation ? "Hide Conversation" : "Show Conversation"}
      </button>
    </div>
  )
}
export default ShowCoversationButton