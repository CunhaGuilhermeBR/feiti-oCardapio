import OpenAI from 'openai'

export type createCompletionInput = {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  response_format?:
  | OpenAI.Chat.Completions.ChatCompletionCreateParams.ResponseFormat
  | undefined;
}

export type Messages = {
	content: string
	role: 'user' | 'assistant' | 'system'
  }[]
