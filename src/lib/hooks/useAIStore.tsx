import { create } from 'zustand';
import { AIOptions, CodeMessageResponse, SnackbarOptions } from '../model';
import { MessageParam } from './use-ai';
import { nanoid } from 'ai';

export interface AIStore {
  aiOptions: AIOptions
  setAIOptions: (options: AIOptions) => void
  aiMessages?: MessageParam[] | []
  aiResponses?: CodeMessageResponse[]
  setAIMessages: (messages: MessageParam[]) => void
  appendAIMessage: (message: MessageParam) => void
  updateLastAIMessage: (content: string) => void
  appendChunkToLastAIMessage: (chunk: string) => void
  appendAIResponse: (response: CodeMessageResponse) => void
  updateLastAIResponse: (response: CodeMessageResponse) => void
}

/**
 * A hook to subscribe to the store. Look at https://github.com/pmndrs/zustand for more
 * documentation
 */
const useAIStore = create<AIStore>((set) => ({
  aiMessages: [],
  aiResponses: [],
  aiOptions: {
    id: nanoid(),
    mode: 'speed',
    isPrivate: false,
  },

  setAIOptions: (aiOptions: AIOptions) => {
    set({
      aiOptions,
    });
  },

  setAIMessages: (messages: MessageParam[]) => {
    set({
      aiMessages: messages,
    });
  },
  appendAIMessage: (message: MessageParam) => {
    set((state: AIStore) => {
      return {
        aiMessages: [...state.aiMessages || [], message],
      };
    });
  },
  appendAIResponse: (response: CodeMessageResponse) => {
    set((state: AIStore) => {
      return {
        aiResponses: [...state.aiResponses || [], response],
      };
    });
  },
  updateLastAIResponse: (response: CodeMessageResponse) => {
    set((state: AIStore) => {
      const responses = [...state.aiResponses || []]; // Create a new array to ensure immutability
      if (responses.length > 0) {
        responses[responses.length - 1] = response; // Replace the last message with the updated one
      }
      return {
        aiResponses: responses,
      };
    });
  },
  updateLastAIMessage: (content: string) => {
    set((state: AIStore) => {
      const messages = [...state.aiMessages || []]; // Create a new array to ensure immutability
      if (messages.length > 0) {
        const lastMessage = { ...messages[messages.length - 1] }; // Clone the last message
        lastMessage.content = content; // Update the content
        messages[messages.length - 1] = lastMessage; // Replace the last message with the updated one
      }
      return {
        aiMessages: messages,
      };
    });
  },
  appendChunkToLastAIMessage: (chunk: string) => {
    set((state: AIStore) => {
      if (!state.aiMessages) {
        return state;
      }
      const messages = [...state.aiMessages || []];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        lastMessage.content += chunk;
        messages[messages.length - 1] = { ...lastMessage };
      }
      return {
        aiMessages: messages,
      };
    });
  },
}))

export default useAIStore;
