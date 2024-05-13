import { SidebarActions } from '@/components/sidebar-actions'
import { SidebarItem } from '@/components/sidebar-item'

export interface SidebarListProps {
  userId?: string
}
const getChats = (userId: string) => {
  return [{
    id: '1',
    title: 'Chat 1',
    participants: [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits',
      }]
  }]
}
const removeChat = (chatId: string) => { }
const shareChat = (chatId: string) => { }
export async function SidebarList({ userId }: SidebarListProps) {
  if (!userId) {
    return
  }
  const chats = getChats(userId)

  return (
    <div className="flex-1 overflow-auto">
      {chats?.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            chat =>
              chat && (
                <div key={chat?.id}>
                  {/*
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem> */}
                </div>
              )
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
