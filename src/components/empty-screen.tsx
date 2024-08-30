import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'Accordion with transitions',
    message: `Create an accordion component that animates the opening and closing of the content.`,
  },
  {
    heading: 'Interactive form',
    message: 'Create a form with fields for name, email, and message, and a submit button. Validate all fields.'
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Magnolia, the React component builder.
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is AI chatbot app is built for creating React components {' '}
          using tools from {' '}
          <ExternalLink href="https://openai.com">
            OpenAI
          </ExternalLink>
          {' and '}
          <ExternalLink href="https://vercel.com">
            Vercel
          </ExternalLink>.

          {'\n'}
        </p>
        <p className='leading-normal text-muted-foreground'>
          The full source code for this project is available on {' '}
          <ExternalLink href="https://github.com/antonmagnus/open-v0">
            Github
          </ExternalLink>.
          And you can read more about the project on my {' '}
          <ExternalLink href="https://antonmagnusson.se">
            blog
          </ExternalLink>.

          {'\n'}
        </p>
        <p className='leading-normal text-muted-foreground'>
          The data  you enter is controlled by you and not used to train the AI.
          However, don&apos;t enter any sensitive information.
          Please use your own judgement when using this tool.
          {'\n'}
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a creating a new component here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
