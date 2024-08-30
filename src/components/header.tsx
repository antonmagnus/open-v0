import * as React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconMagnolia,
  IconSeparator,
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'

import ShowCoversationButton from './conversation-button'
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import clsx from 'clsx'
import { NewProjectButton } from './new-project-button'

export async function Header() {
  const session = await getServerSession(authOptions)
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
                <NewProjectButton />
                <div>
                  <ThemeToggle />
                  {/* <ClearHistory clearProjects={clearProjects} /> */}
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconMagnolia className="mr-2 h-6 w-6 dark:hidden" />
            <IconMagnolia className="mr-2 hidden h-6 w-6 dark:block" inverted />
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
        </div>
      </div>
      <ShowCoversationButton className={clsx(!session?.user && 'hidden')} />
    </header>
  )
}
