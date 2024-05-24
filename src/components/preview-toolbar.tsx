import { Button } from "@/components/ui/button"
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { HTMLAttributes, useState, useCallback, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { IconLaptop, IconSmartphone, IconSpinner, IconTablet, IconUsers } from "./ui/icons"
import clsx from "clsx"
import Link from "next/link"
import { Project } from "@/lib/model"
import toast from "react-hot-toast"
import useAI from "@/lib/hooks/use-ai"
import { badgeVariants } from "./ui/badge"
import { shareProject } from "@/app/actions/projects"
import { formatDate } from "@/lib/utils"

interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  toggleCode: () => void
  shareCode: () => void
  copyCode: () => void
  saveCode: () => void
  toggleTabletView: () => void
  toggleMobileView: () => void
  toggleDesktopView: () => void
}


export function PreviewToolbar(toolbarProps: ToolbarProps) {
  const { toggleCode, shareCode, copyCode, saveCode, toggleDesktopView, toggleMobileView, toggleTabletView } = toolbarProps
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [isSharePending, startShareTransition] = useTransition()

  const { project } = useAI()
  const copyShareLink = useCallback(async (project: Project) => {
    if (!project.sharePath) {
      return toast.error('Could not copy share link to clipboard')
    }

    const url = new URL(window.location.href)
    url.pathname = project.sharePath
    navigator.clipboard.writeText(url.toString())
    setShareDialogOpen(false)
    toast.success('Share link copied to clipboard', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontSize: '14px'
      },
      iconTheme: {
        primary: 'white',
        secondary: 'black'
      }
    })
  }, [])

  return (
    <div className="flex justify-end items-center gap-2 p-2 border border-gray-200 dark:border-gray-800">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="hidden lg:block">
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={toggleDesktopView}>
              <IconLaptop className="h-4 w-4" />
              <span className="sr-only">Preview Desktop View</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview Desktop View</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild className="hidden md:block">
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={toggleTabletView}>
              <IconTablet className="h-4 w-4" />
              <span className="sr-only">Preview Tablet View</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview Tablet View</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild className="hidden md:block">
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={toggleMobileView}>
              <IconSmartphone className="h-4 w-4" />
              <span className="sr-only">Preview Mobile View</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Preview Mobile View</TooltipContent>
        </Tooltip>
        <div
          className="hidden md:block  border-l border-gray-800 dark:border-gray-200 h-6"
          aria-hidden="true"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={toggleCode}>
              <CodeIcon className="h-4 w-4" />
              <span className="sr-only">Toggle code</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle code</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={() => setShareDialogOpen(true)}
            >
              <ShareIcon className="h-4 w-4" />
              <span className="sr-only">Share code</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share code</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={copyCode}
            >
              <CopyIcon className="h-4 w-4" />
              <span className="sr-only">Copy code</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy code</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-full" size="icon" variant="ghost"
              onClick={saveCode}
            >
              <SaveIcon className="h-4 w-4" />
              <span className="sr-only">Save code</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save code</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Share dialog       */}

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link to project</DialogTitle>
            <DialogDescription>
              Anyone with the URL will be able to view the shared project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1 rounded-md border p-4 text-sm">
            <div className="font-medium">{project.title}</div>
            <div className="text-muted-foreground">
              {formatDate(project.createdAt)} · {project.messages.length} messages
            </div>
          </div>
          <DialogFooter className="items-center">
            {project.sharePath && (
              <Link
                href={project.sharePath}
                className={clsx(
                  badgeVariants({ variant: 'secondary' }),
                  'mr-auto'
                )}
                target="_blank"
              >
                <IconUsers className="mr-2" />
                {project.sharePath}
              </Link>
            )}
            <Button
              disabled={isSharePending}
              onClick={() => {
                startShareTransition(async () => {
                  if (project.sharePath) {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    copyShareLink(project)
                    return
                  }
                  const result = await shareProject(project)
                  if (result && 'error' in result) {
                    toast.error(result.error)
                    return
                  }

                  copyShareLink(result)
                })
              }}
            >
              {isSharePending ? (
                <>
                  <IconSpinner className="mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>Copy link</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}


function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}


function SaveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}


function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}
