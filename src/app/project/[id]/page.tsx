'use server'
import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

import { getProject } from '@/app/actions/projects'
import { Project } from '@/lib/model'
import useAI from '@/lib/hooks/use-ai'
import { AIOptions } from '@/lib/model'
import AppPage from '@/components/app-page'


export interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ProjectPageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {}
  }

  const project = await getProject(params.id, session?.user?.id)
  return {
    title: project?.title.toString().slice(0, 50) ?? 'Project'
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/sign-in?next=/project/${params.id}`)
  }


  const project: Project | null = await getProject(params.id, session?.user?.id)
  if (!project) {
    notFound()
  }
  if (project?.userId != session?.user?.id) {
    notFound()
  }

  return <AppPage project={project} preview={false} />

}
