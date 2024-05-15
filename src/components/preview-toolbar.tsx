import { Button } from "@/components/ui/button"
import { TooltipTrigger, TooltipContent, Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { HTMLAttributes } from "react"

interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  toggleCode: () => void
  shareCode: () => void
  copyCode: () => void
  saveCode: () => void
}


export function PreviewToolbar(toolbarProps: ToolbarProps) {
  const { toggleCode, shareCode, copyCode, saveCode } = toolbarProps

  return (
    <div className="flex justify-end items-center gap-2 p-2 border border-gray-200 dark:border-gray-800">
      <TooltipProvider>
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
              onClick={shareCode}
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
