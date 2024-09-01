"use client"
import { Button } from "@/components/ui/button"
import useAI from "@/lib/hooks/use-ai"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import clsx from "clsx"
import { HTMLAttributes, JSX, SVGProps, useEffect, useState } from "react"
import toast from "react-hot-toast"

interface PromptProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  showPrivate: boolean
  input?: string
}


export function PromptForm({ className, id, showPrivate, input }: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const [prompt, setPrompt] = useState<string>(input || "")
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [quality, setQuality] = useState<boolean>(true)
  const [speed, setSpeed] = useState<boolean>(false)
  const { sendMessage, setMode, setPrivate } = useAI()

  const toggleQuality = () => {
    setQuality(true)
    setSpeed(false)
    setMode("quality")
    return toast.success('Now using gpt-4o')
  }
  const toggleSpeed = () => {
    setQuality(false)
    setSpeed(true)
    setMode("speed")
    return toast.success('Now using gpt-4o-mini')
  }
  const togglePrivate = () => {
    setIsPrivate(!isPrivate)
    setPrivate(!isPrivate)
  }

  useEffect(() => {
    setPrompt(input || "")
  }, [input])

  const submitPrompt = (event: React.FormEvent) => {

    event.preventDefault();  // Prevent default form submit behavior
    if (!prompt) {
      // Optionally, add feedback here
      return;
    }
    sendMessage({ role: "user", content: prompt });
    setPrompt("");  // Reset prompt after sending
  }

  const selectImage = () => {
    return toast.error('Image upload not supported yet')
  }

  return (
    <>

      <form ref={formRef} onSubmit={(e) => submitPrompt(e)} className={clsx(className)}>
        <div className="pb-4">
          <textarea
            className="w-full min-h-10 px-4 pt-2 rounded-md text-accent-foreground bg-muted/70 bg-opacity-70 backdrop-blur-xl placeholder-gray-400 border-gray-200 border focus:outline-none focus:border-gray-500 transition-all duration-200 ease-in-out"
            placeholder="Type here..."
            value={prompt}
            onKeyDown={onKeyDown}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button className="" variant="ghost"
              type="button"
              onClick={selectImage}
            >
              <ImageIcon className="h-5 w-5" />
              <p className="px-2">Image</p>
            </Button>
            <Button className={clsx(!showPrivate && "hidden", "")} variant="ghost"
              type="button"
              onClick={togglePrivate}
            >
              {isPrivate ?
                <LockIcon className="h-5 w-5" />
                :
                <UnlockIcon className="h-5 w-5" />
              }
              <p className="px-2">
                {isPrivate ? "Private" : "Public"}
              </p>
            </Button>
          </div>
          <div className="flex space-x-4" aria-label="Quality or Speed">
            <div className="flex rounded-md ">
              <Button className="rounded-r-none"
                type="button"
                variant={quality ? "highlight" : "outline"}
                onClick={toggleQuality}
              >
                Quality
              </Button>
              <Button className="rounded-l-none"
                type="button"
                variant={speed ? "highlight" : "outline"}
                onClick={toggleSpeed}
              >
                Speed
              </Button>
            </div>
            <button type="submit" className=""
              disabled={!prompt}>
              <ArrowUpIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </form>

    </>

  )
}

function ArrowUpIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  )
}


function ImageIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}


function LockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function UnlockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}







