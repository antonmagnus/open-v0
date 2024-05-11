import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIOptions, SnackbarOptions } from '../model';
import { MessageParam } from './use-ai';
import { nanoid } from 'ai';

export interface Store {
  snackbarOptions?: SnackbarOptions
  // eslint-disable-next-line no-unused-vars
  setSnackbarOptions: (options: SnackbarOptions | undefined) => void
  aiOptions: AIOptions
  setAIOptions: (options: AIOptions) => void
  aiMessages?: MessageParam[] | []
  setAIMessages: (messages: MessageParam[]) => void
  appendAIMessage: (message: MessageParam) => void
  updateLastAIMessage: (message: MessageParam) => void
}

/**
 * A hook to subscribe to the store. Look at https://github.com/pmndrs/zustand for more
 * documentation
 */
const useStore = create<Store>()(
  // eslint-disable-next-line no-unused-vars
  (set) => ({
    snackbarOptions: undefined,
    setSnackbarOptions: (snackbarOptions: SnackbarOptions | undefined) => {
      set({
        snackbarOptions,
      });
    },

    aiOptions: {
      id: nanoid(),
      mode: 'speed',
      isPrivate: false,
    },
    setAIOptions: (aiOptions: AIOptions | undefined) => {
      set({
        aiOptions,
      });
    },
    aiMessages: [],
    setAIMessages: (messages: MessageParam[]) => {
      set({
        aiMessages: messages,
      });
    },
    appendAIMessage: (message: MessageParam) => {
      set((state) => {
        const messages = state.aiMessages || [];
        return {
          aiMessages: [...messages, message],
        };
      });
    },
    updateLastAIMessage: (message: MessageParam) => {
      set((state) => {
        const messages = state.aiMessages || [];
        messages[messages.length - 1] = message;
        return {
          aiMessages: messages,
        };
      });
    },
  })

);

export default useStore;
