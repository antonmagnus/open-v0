'use client'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { AIOptions, CodeMessageResponse, PostMessages, Project } from '../model';
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react';
import useAIStore, { AIStore } from './useAIStore';
import { generate } from '../../app/actions/stream'
import { readStreamableValue } from 'ai/rsc';
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


  const [project, setProject, aiResponses, updateAIOptions, appendAIMessage, appendChunkToLastAIMessage, updateLastAIMessage, appendLastAIResponse, updateLastAIResponse, setAIMessages, isPreview, setIsPreview] = useAIStore(
    useShallow((state: AIStore) => [
      state.project,
      state.setProject,
      state.aiResponses,
      state.updateAIOptions,
      state.appendAIMessage,
      state.appendChunkToLastAIMessage,
      state.updateLastAIMessage,
      state.appendAIResponse,
      state.updateLastAIResponse,
      state.setAIMessages,
      state.isPreview,
      state.setIsPreview,
    ]),
  )
  //const session = useSession()
  const aiMessagesRef = useRef(project.messages);
  aiMessagesRef.current = project.messages;

  useEffect(() => {
    aiMessagesRef.current = project.messages; // Update ref whenever aiMessages changes
  }, [project.messages]);


  const sendMessage = async (message: MessageParam) => {
    // sends a message to the server
    // gets the code appended
    if (!project || isPreview) {
      return;
    }
    appendAIMessage(message);

    const sendMessage: PostMessages = {
      project: useAIStore.getState().project,
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
    updateAIOptions({ mode });
  }

  const setPrivate = (isPrivate: boolean) => {
    updateAIOptions({ isPrivate });
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

  const initProject = (project: Project, isPreview: boolean) => {
    setProject(project);
    setIsPreview(isPreview);
  }

  return { project, initProject, isPreview, updateAIOptions, setMode, setPrivate, sendMessage, aiResponses, updateLastResponse };
}
export default useAI;
