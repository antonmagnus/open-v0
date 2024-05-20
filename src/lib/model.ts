import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { MessageParam } from "./hooks/use-ai";


export type PostMessages = {
  project: Project,
}
export const LatestCodeMessageResponseVersion = "1.0.0"
export type CodeMessageResponse = {
  code: string,
  plan?: string,
  description: string,
  title?: string,
  version: string,
}

export interface SnackbarOptions {
  title: string,
  body: string,
  severity: SnackbarSeverity,
}
// eslint-disable-next-line no-shadow
export enum SnackbarSeverity {
  // eslint-disable-next-line no-unused-vars
  Info,
  // eslint-disable-next-line no-unused-vars
  Debug,
  // eslint-disable-next-line no-unused-vars
  Warning,
  // eslint-disable-next-line no-unused-vars
  Error,
  // eslint-disable-next-line no-unused-vars
  Success,
}

export interface AIOptions {
  mode: "quality" | "speed",
  isPrivate: boolean,
}

export interface Project extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: MessageParam[]
  sharePath?: string
  mode: "quality" | "speed",
  isPrivate: boolean,
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
    error: string
  }
>
