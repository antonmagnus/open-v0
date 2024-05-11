"use client"
import { Button } from "@/components/ui/button"
import useAI from "@/lib/hooks/use-ai"
import clsx from "clsx"
import { HTMLAttributes, JSX, SVGProps, useState } from "react"


interface PromptProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  showPrivate: boolean
}


export function PromptForm({ className, id, showPrivate }: PromptProps) {
  const [prompt, setPrompt] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [quality, setQuality] = useState<boolean>(false)
  const [speed, setSpeed] = useState<boolean>(true)

  const { sendMessage, sendTestMessage, setMode, setPrivate, aiMessages } = useAI()

  const toggleQuality = () => {
    setQuality(true)
    setSpeed(false)
    setMode("quality")
  }
  const toggleSpeed = () => {
    setQuality(false)
    setSpeed(true)
    setMode("speed")

  }
  const togglePrivate = () => {
    setIsPrivate(!isPrivate)
    setPrivate(!isPrivate)
  }
  const submitPrompt = () => {
    if (!prompt) {
      return
    }
    sendMessage({ role: "user", content: prompt })
    //sendTestMessage()
    setPrompt("")
  }
  const selectImage = () => {
    console.log("Image uploaded")
    console.log("messages: ", aiMessages)
  }

  return (
    <>
      <div className={clsx(className, "w-full overflow-y-scroll max-w-2xl")}>

        <div className={clsx(className, "w-full overflow-y-scroll max-w-2xl")}>
          <div className="mt-4 p-12">
            {aiMessages?.map((msg, i) => (
              <div key={i} className="flex space-4">
                <div className="flex text-white items-center space-x-4">
                  <p>{msg.role}:</p>
                  <p>{msg.content as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sticky p-4 w-full bg-black inset-x-0 bottom-0">
          <div className="pb-6">
            <textarea
              className="w-full min-h-12 px-4 py-2 bg-transparent rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-all duration-200 ease-in-out"
              placeholder="Type here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Button className="text-gray-400" variant="ghost"
                onClick={selectImage}
              >
                <ImageIcon className="h-5 w-5" />
                <p className="px-2">Image</p>
              </Button>
              <Button className="text-gray-400" variant="ghost"
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
              <div className="flex rounded-md bg-gray-900 border ">
                <Button className="text-gray-400 bg-gray-800"
                  variant={quality ? "default" : "outline"}
                  onClick={toggleQuality}
                >
                  Quality
                </Button>
                <Button className="text-gray-400"
                  variant={speed ? "default" : "outline"}
                  onClick={toggleSpeed}
                >
                  Speed
                </Button>
              </div>
              <button className="text-white bg-black"
                onClick={submitPrompt}
                disabled={!prompt}>
                <ArrowUpIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

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







