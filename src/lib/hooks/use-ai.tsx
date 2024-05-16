'use client'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { AIOptions, CodeMessageResponse, PostMessages } from '../model';
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react';
import useAIStore, { AIStore } from './useAIStore';
import { generate } from '../../app/actions/stream'
import { readStreamableValue } from 'ai/rsc';
import { auth } from '@/auth';
//import { useSession } from 'next-auth/react';
export type MessageParam = ChatCompletionMessageParam

const testResponseChunks: string[] = [
  "0:\"```\"\n",
  "0:\"jsx\"\n0:\"\\n\"\n",
  "0:\"import\"\n0:\" React\"\n",
  "0:\" from\"\n0:\" '\"\n",
  "0:\"react\"\n0:\"';\\n\\n\"\n",
  "0:\"const\"\n0:\" App\"\n",
  "0:\" =\"\n0:\" ()\"\n",
  "0:\" =>\"\n0:\" {\\n\"\n",
  "0:\" \"\n0:\" return\"\n",
  "0:\" (\\n\"\n0:\"   \"\n",
  "0:\" <\"\n0:\"div\"\n",
  "0:\" className\"\n0:\"=\\\"\"\n",
  "0:\"flex\"\n0:\" justify\"\n",
  "0:\"-center\"\n0:\" items\"\n",
  "0:\"-center\"\n0:\" h\"\n0:\"-screen\"\n0:\"\\\">\\n\"\n0:\"     \"\n0:\" <\"\n0:\"h\"\n0:\"1\"\n0:\" className\"\n0:\"=\\\"\"\n",
  "0:\"text\"\n0:\"-\"\n",
  "0:\"3\"\n0:\"xl\"\n",
  "0:\" font\"\n0:\"-bold\"\n",
  "0:\"\\\">\"\n0:\"Hi\"\n",
  "0:\"</\"\n0:\"h\"\n",
  "0:\"1\"\n0:\">\\n\"\n",
  "0:\"   \"\n0:\" </\"\n",
  "0:\"div\"\n0:\">\\n\"\n",
  "0:\" \"\n0:\" );\\n\"\n",
  "0:\"};\\n\\n\"\n0:\"export\"\n",
  "0:\" default\"\n0:\" App\"\n",
  "0:\";\\n\"\n0:\"```\"\n"
]

function useAI() {


  const [aiMessages, aiResponses, aiOptions, setAIOptions, appendAIMessage, appendChunkToLastAIMessage, updateLastAIMessage, appendLastAIResponse, updateLastAIResponse, setAIMessages] = useAIStore(
    useShallow((state: AIStore) => [
      state.aiMessages,
      state.aiResponses,
      state.aiOptions,
      state.setAIOptions,
      state.appendAIMessage,
      state.appendChunkToLastAIMessage,
      state.updateLastAIMessage,
      state.appendAIResponse,
      state.updateLastAIResponse,
      state.setAIMessages
    ]),
  )
  //const session = useSession()
  const aiMessagesRef = useRef(aiMessages);
  aiMessagesRef.current = aiMessages;

  useEffect(() => {
    aiMessagesRef.current = aiMessages; // Update ref whenever aiMessages changes
  }, [aiMessages]);


  const sendMessage = async (message: MessageParam) => {
    // sends a message to the server
    // gets the code appended
    if (!aiOptions) {
      return;
    }
    appendAIMessage(message);

    const sendMessage: PostMessages = {
      messages: useAIStore.getState().aiMessages || [],
      aiOpitons: aiOptions,
    };
    try {
      generate(sendMessage).then(async (res) => {
        if (res && 'object' in res) {
          const { object } = res;
          const message: MessageParam = {
            content: "",
            role: "assistant",
          };
          appendAIMessage(message);
          appendLastAIResponse({ code: "", description: "" });

          // @ts-ignore
          for await (const partialObject of readStreamableValue(object)) {
            if (partialObject) {
              updateLastAIResponse(partialObject)
              updateLastAIMessage(JSON.stringify(partialObject))
            }
          }
        }
      })
    } catch (error) {
      console.log("Error sending message", error);
    }
  }

  const setMode = (mode: "quality" | "speed") => {
    setAIOptions({ ...aiOptions, mode });
  }

  const setPrivate = (isPrivate: boolean) => {
    setAIOptions({ ...aiOptions, isPrivate });
  }

  const updateLastResponse = (content: string) => {
    if (!aiResponses || aiResponses.length === 0) {
      return;
    }
    const desc = aiResponses[aiResponses.length - 1].description;
    const newResponse = { code: content, description: desc };
    updateLastAIMessage(JSON.stringify(newResponse));
    updateLastAIResponse({ code: content, description: desc });
  }

  const initProject = (aiOptions: AIOptions, aiMessages: ChatCompletionMessageParam[]) => {
    setAIOptions(aiOptions);
    setAIMessages(aiMessages);
  }

  return { initProject, setAIOptions, setMode, setPrivate, sendMessage, aiMessages, aiResponses, updateLastResponse };
}
export default useAI;
