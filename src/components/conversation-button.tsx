'use client'
import useShowCoversationStore from "@/lib/hooks/useShowCoversationStore"
import clsx from "clsx"
import { HTMLAttributes } from "react"


const ShowCoversationButton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  const { showConversation, setShowConversation } = useShowCoversationStore()
  return (
    <div className={clsx(className, "flex flex-row items-center space-x-4")}>
      <button className="text-white" onClick={() => setShowConversation(!showConversation)}>
        {showConversation ? "Hide Conversation" : "Show Conversation"}
      </button>
    </div>
  )
}
export default ShowCoversationButton