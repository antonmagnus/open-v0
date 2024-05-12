import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { AIOptions, CodeMessageResponse, PostMessages } from '../model';
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react';
import useAIStore, { AIStore } from './useAIStore';
import { generate } from '../../app/actions/stream'
import { readStreamableValue } from 'ai/rsc';
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

  // useEffect(() => {
  //   setAIOptions(initOptions);
  // }, [initOptions, setAIOptions]);

  const [aiMessages, aiOptions, setAIOptions, appendAIMessage, appendChunkToLastAIMessage, updateLastAIMessage] = useAIStore(
    useShallow((state: AIStore) => [
      state.aiMessages,
      state.aiOptions,
      state.setAIOptions,
      state.appendAIMessage,
      state.appendChunkToLastAIMessage,
      state.updateLastAIMessage,
    ]),
  )

  const aiMessagesRef = useRef(aiMessages);
  aiMessagesRef.current = aiMessages;

  useEffect(() => {
    aiMessagesRef.current = aiMessages; // Update ref whenever aiMessages changes
  }, [aiMessages]);


  const sendMessage = (message: MessageParam) => {
    // sends a message to the server
    // gets the code appended
    if (!aiOptions) {
      return;
    }
    appendAIMessage(message);
    const sendMessage: PostMessages = {
      messages: useAIStore.getState().aiMessages || [],
      mode: aiOptions.mode,
      isPrivate: false,
    };

    generate(sendMessage).then(async (res) => {
      if (res && 'object' in res) {
        const { object } = res;
        const message: MessageParam = {
          content: "",
          role: "assistant",
        };
        appendAIMessage(message);

        for await (const partialObject of readStreamableValue(object)) {
          if (partialObject) {
            updateLastAIMessage(partialObject.code)
          }
        }
      }
    })
  }

  const setMode = (mode: "quality" | "speed") => {
    setAIOptions({ ...aiOptions, mode });
  }

  const setPrivate = (isPrivate: boolean) => {
    setAIOptions({ ...aiOptions, isPrivate });
  }

  const updateLastMessage = (content: string) => {
    updateLastAIMessage(content);
  }

  return { setAIOptions, setMode, setPrivate, sendMessage, aiMessages, updateLastMessage };
}
export default useAI;
