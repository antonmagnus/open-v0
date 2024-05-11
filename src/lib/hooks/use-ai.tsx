import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { AIOptions, PostMessages } from '../model';
import { useShallow } from 'zustand/react/shallow'
import { useEffect, useRef } from 'react';
import useAIStore, { AIStore } from './useAIStore';

export type MessageParam = ChatCompletionMessageParam
const testRe1sponseChunks: string[] = [
  '0:"```"',
  '0:"jsx"',
  '0:"\n"',
  '0:"import"',
  '0:" React"',
  '0:" from"',
  '0:" \'"',
  '0:"react"',
  '0:"\';\n\n"',
  '0:"const"',
  '0:" App"',
  '0:" ="',
  '0:" ()"',
  '0:" =>"',
  '0:" {\n"',
  '0:" "',
  '0:" return"',
  '0:" (\n"',
  '0:"   "',
  '0:" <"',
  '0:"div"',
  '0:" className"',
  '0:"=\\""',
  '0:"flex"',
  '0:" justify"',
  '0:"-center"',
  '0:" items"',
  '0:"-center"',
  '0:" h"',
  '0:"-screen"',
  '0:"\\">\n"',
  '0:"     "',
  '0:" <"',
  '0:"h"',
  '0:"1"',
  '0:" className"',
  '0:"=\\""',
  '0:"text"',
  '0:"-"',
  '0:"3"',
  '0:"xl"',
  '0:" font"',
  '0:"-bold"',
  '0:"\\">',
  '0:"Hi"',
  '0:"</"',
  '0:"h"',
  '0:"1"',
  '0:">\\n"',
  '0:"   "',
  '0:" </"',
  '0:"div"',
  '0:">\\n"',
  '0:" "',
  '0:" );\n"',
  '0:"};\n\n"',
  '0:"export"',
  '0:" default"',
  '0:" App"',
  '0:";\n"',
  '0:"```"',
];
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
const parseChunk = (chunk: string) => {
  console.log("Chunk: ", chunk);
  // Remove the leading "0:\"" and the trailing "\"\n" from the chunk
  const cleanChunk = chunk.replace(/0:"|"\n/g, '');

  // Replace any escaped double quotes inside the string
  const finalChunk = cleanChunk.replace(/\\"/g, '"');

  return finalChunk;
  //return chunk.replace(/0:"(.*?)"(\s*)([?!.,;:]?)/g, (match, text, space, punct) => text + punct);
}
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


  const apiPath = "/api/generate";


  const aiMessagesRef = useRef(aiMessages);
  aiMessagesRef.current = aiMessages;

  useEffect(() => {
    aiMessagesRef.current = aiMessages; // Update ref whenever aiMessages changes
  }, [aiMessages]);

  async function storeChunksAsMessage(response: Response) {
    if (!response.body) {
      throw new Error("ReadableStream not yet supported in this browser.");
    }
    const message: MessageParam = {
      content: "",
      role: "assistant",
    };
    // console.log("pre messages", messages);
    // console.log("next messages", [...(messages || []), message]);
    appendAIMessage(message);
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    const s = []
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("s arr: ", s);
        return;
      }
      let decodedValue = decoder.decode(value, { stream: true });
      //decodedValue = decodedValue.replace(/0:"(.*?)"(\s*)([?!.,;:]?)/g, (match, text, space, punct) => text + punct);
      //console.log("Decoded value: ", decodedValue);
      let chunk = parseChunk(decodedValue);
      s.push(decodedValue);
      appendChunkToLastAIMessage(chunk);
      // Otherwise do something here to process current chunk
    }

  }

  const sendMessage = (message: MessageParam) => {
    if (!aiOptions) {
      return;
    }
    appendAIMessage(message);
    const sendMessage: PostMessages = {
      messages: useAIStore.getState().aiMessages || [],
      mode: aiOptions.mode,
      isPrivate: false,
    };
    fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendMessage),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Prompt submitted");
          storeChunksAsMessage(response);
          // add the sent message and the response to the message store
        } else {
          console.error("Failed to submit prompt");
        }
      })
      .catch((error) => {
        console.error("Failed to submit prompt", error);
      });
  }

  const sendTestMessage = () => {
    const userMessage: MessageParam = {
      content: "Hello",
      role: "user",
    };
    appendAIMessage(userMessage);

    const message: MessageParam = {
      content: "",
      role: "assistant",
    };
    // console.log("pre messages", messages);
    // console.log("next messages", [...(messages || []), message]);
    appendAIMessage(message);

    for (let i = 0; i < testResponseChunks.length; i++) {
      const chunk = testResponseChunks[i];
      appendChunkToLastAIMessage(parseChunk(chunk));
    }
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

  return { setAIOptions, setMode, setPrivate, sendMessage, sendTestMessage, aiMessages, updateLastMessage };
}
export default useAI;
