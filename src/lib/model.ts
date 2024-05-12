import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";


export type PostMessages = {
  id?: string,
  messages: ChatCompletionMessageParam[],
  mode: "quality" | "speed",
  isPrivate: boolean,
}

export type CodeMessageResponse = {
  code: string,
  description: string,
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
  id: string,
  mode: "quality" | "speed",
  isPrivate: boolean,
}