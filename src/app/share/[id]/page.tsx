
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getSharedProject } from '@/app/actions/projects'
import AppPage from '@/components/app-page'

export const runtime = 'edge'
export const preferredRegion = 'home'

interface SharePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: SharePageProps): Promise<Metadata> {
  const chat = await getSharedProject(params.id)

  return {
    title: chat?.title.slice(0, 50) ?? 'Project'
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const project = await getSharedProject(params.id)
  if (!project || !project?.sharePath) {
    notFound()
  }

  return (
    <>
      <AppPage project={project} preview={true} />
    </>
  )
}
