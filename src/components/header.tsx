import * as React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'
import { ServerActionResult } from '@/lib/types'
import useAI from '@/lib/hooks/use-ai'
import ShowCoversationButton from './conversation-button'

export async function Header() {
  const session = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'test'
    }
  }

  return (
    <header className="top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <div className='m-2 flex w-full flex-col'>
                <Button className='p-5'>
                  <Link href="/">New Chat</Link>
                </Button>
                <div>
                  <ThemeToggle />
                  {/* <ClearHistory clearChats={clearChats} /> */}
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
            <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in?callbackUrl=/">Login</Link>
            </Button>
          )}
          <ShowCoversationButton />
        </div>
      </div>
    </header>
  )
}
