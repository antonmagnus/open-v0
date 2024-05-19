import { create } from 'zustand';
import { AIOptions, CodeMessageResponse, Project, SnackbarOptions } from '../model';
import { MessageParam } from './use-ai';
import { nanoid } from 'ai';

export interface AIStore {
  project: Project,
  setProject: (project: Project) => void
  isPreview: boolean,
  setIsPreview: (isPreview: boolean) => void
  updateAIOptions: (options: Partial<AIOptions>) => void
  aiResponses?: CodeMessageResponse[]
  setAIMessages: (messages: MessageParam[]) => void
  appendAIMessage: (message: MessageParam) => void
  updateLastAIMessage: (content: string) => void
  appendChunkToLastAIMessage: (chunk: string) => void
  appendAIResponse: (response: CodeMessageResponse) => void
  updateLastAIResponse: (response: CodeMessageResponse) => void
}

const assistantMessageToCodeMessageResponse = (message: MessageParam): CodeMessageResponse => {

  // // @ts-ignore
  // let content = ''
  // for (const partialObject of message.content as ChatCompletionContentPart[]) {
  //   if (partialObject) {
  //     content += partialObject
  //   }
  // }
  // const storedResponse = JSON.parse(content)
  // return storedResponse.curr
  const content = JSON.parse(message.content as string) as CodeMessageResponse

  return content
}
/**
 * A hook to subscribe to the store. Look at https://github.com/pmndrs/zustand for more
 * documentation
 */
const useAIStore = create<AIStore>((set,) => ({
  isPreview: false,
  aiResponses: [],
  project: {
    id: nanoid(),
    title: 'Untitled Project',
    createdAt: new Date(),
    userId: '',
    path: '',
    messages: [],
    mode: 'speed',
    isPrivate: false,
  },
  setProject: (project: Project) => {
    const responses: CodeMessageResponse[] = [];
    for (const message of project.messages) {
      if (message.role === 'assistant') {
        const mes = assistantMessageToCodeMessageResponse(message)
        responses.push(mes);
      }
    }
    set({
      project,
      aiResponses: responses,
    });
  },

  setIsPreview: (isPreview: boolean) => {
    set({
      isPreview,
    });
  },

  updateAIOptions: (aiOptions: Partial<AIOptions>) => {
    set((state: AIStore) => {
      const mode = aiOptions.mode || state.project.mode;
      const isPrivate = aiOptions.isPrivate || state.project.isPrivate;
      return {
        project: {
          ...state.project,
          mode,
          isPrivate,
        },
      };
    });
  },

  setAIMessages: (messages: MessageParam[]) => {
    const responses: CodeMessageResponse[] = [];
    for (const message of messages) {
      if (message.role === 'assistant') {
        const mes = assistantMessageToCodeMessageResponse(message)
        responses.push(mes);
      }
    }
    set((state: AIStore) => {
      return {
        project: {
          ...state.project,
          messages,
        },
        aiResponses: responses,
      };
    });
  },
  appendAIMessage: (message: MessageParam) => {
    set((state: AIStore) => {
      return {
        project: {
          ...state.project,
          messages: [...state.project.messages || [], message],
        },
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
      const messages = [...state.project.messages || []]; // Create a new array to ensure immutability
      if (messages.length > 0) {
        const lastMessage = { ...messages[messages.length - 1] }; // Clone the last message
        lastMessage.content = content; // Update the content
        messages[messages.length - 1] = lastMessage; // Replace the last message with the updated one
      }
      return {
        project: {
          ...state.project,
          messages,
        },
      };
    });
  },
  appendChunkToLastAIMessage: (chunk: string) => {
    set((state: AIStore) => {
      if (!state.project.messages || state.project.messages.length === 0) {
        return state;
      }
      const messages = [...state.project.messages || []];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        lastMessage.content += chunk;
        messages[messages.length - 1] = { ...lastMessage };
      }
      return {
        project: {
          ...state.project,
          messages,
        },
      };
    });
  },
}))

export default useAIStore;
