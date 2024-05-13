import { create } from 'zustand';

export interface ShowCoversationStore {
  showConversation: boolean
  setShowConversation: (showConversation: boolean) => void
}

/**
 * A hook to subscribe to the store. Look at https://github.com/pmndrs/zustand for more
 * documentation
 */
const useShowCoversationStore = create<ShowCoversationStore>((set) => (
  {
    showConversation: false,
    setShowConversation: (showConversation: boolean) => {
      set({
        showConversation,
      });
    },
  }
));

export default useShowCoversationStore;
