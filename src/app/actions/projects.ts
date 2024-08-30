'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { CodeMessageResponse, PrismaProject, Project } from '@/lib/model'
import { MessageParam } from '@/lib/hooks/use-ai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs'
import prisma from '@/lib/prisma'
import { map } from 'zod'
//import { prisma } from './prisma'


const mapPrismaProjectToProject = (prismaProject: PrismaProject): Project => (
  {
    id: prismaProject.id,
    title: prismaProject.title,
    createdAt: prismaProject.createdAt,
    updatedAt: prismaProject.updatedAt,
    userId: prismaProject.userId,
    path: prismaProject.path,
    description: prismaProject.description || '',
    messages: JSON.parse(prismaProject.messages?.toString() || '') as MessageParam[],
    sharePath: prismaProject.sharePath || undefined,
    mode: prismaProject.mode === 'quality' ? 'quality' : 'speed',
    isPrivate: prismaProject.isPrivate,
  });

export async function getProjects(userId?: string | null): Promise<Project[]> {
  if (!userId) {
    return []
  }
  try {

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return projects.map(p => {
      try {
        const proj = mapPrismaProjectToProject(p)
        return proj
      } catch (error) {
        console.error(error)
        return null
      }
    }).filter(proj => proj !== null) as Project[];

  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getProject(id: string, userId: string): Promise<Project | null> {
  try {

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!project || (userId && project.userId !== userId)) {
      return null
    }
    const projectData = mapPrismaProjectToProject(project)

    return projectData
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function removeProject({ id, path }: { id: string; path: string }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  try {

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project || project.userId !== session.user.id) {
      return {
        error: 'Unauthorized'
      }
    }

    await prisma.project.delete({
      where: { id },
    })
    revalidatePath('/')
    return revalidatePath(path)
  } catch (error) {
    console.error(error)
    return {
      error: 'Error deleting project'
    }
  }
}

export async function clearProjects(): Promise<{ error?: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  try {

    await prisma.project.deleteMany({
      where: { userId: session.user.id },
    })

    revalidatePath('/')
    return redirect('/')
  } catch (error) {
    console.error(error)
    return {
      error: 'Error clearing projects'
    }
  }
}

export async function getSharedProject(id: string): Promise<Project | null> {
  try {

    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project || !project.sharePath) {
      return null
    }

    return mapPrismaProjectToProject(project)
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function shareProject(project: Project): Promise<Project | { error: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.id !== project.userId) {
    return {
      error: 'Unauthorized'
    }
  }

  try {

    const updatedProject = await prisma.project.update({
      where: { id: project.id },
      data: {
        sharePath: `/share/${project.id}`,
      },
    })

    return mapPrismaProjectToProject(updatedProject)
  } catch (error) {
    console.error(error)
    return {
      error: 'Error sharing project'
    }
  }
}


export async function storeMessage(projectId: string, completion: CodeMessageResponse, messages: ChatCompletionMessageParam[], userId: string, mode: 'quality' | 'speed', isPrivate: boolean) {

  if (!messages || messages.length === 0) {
    return
  }
  const firstMessage = messages[0].content as string
  const title = completion.title ?? firstMessage.substring(0, 100)

  const path = `/project/${projectId}`

  // Check if the project already exists
  let project = await prisma.project.findUnique({
    where: { id: projectId, userId: userId },
  })

  // If the project does not exist, create it
  const date = new Date()
  const newMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content || '',
  })).concat({
    role: 'assistant',
    content: JSON.stringify(completion),
  })


  // If the project does not exist, create it
  if (!project) {
    await prisma.project.create({
      data: {
        id: projectId,
        title,
        userId,
        createdAt: date,
        updatedAt: date,
        path,
        description: '',
        mode,
        isPrivate,
        sharePath: null,
        messages: JSON.stringify(newMessages),
      },
    })
  } else {
    // If the project exists, update messages field
    await prisma.project.update({
      where: { id: projectId },
      data: {
        messages: {
          push: JSON.stringify(newMessages)
        },
        updatedAt: date,
      }
    })
  }


  // Revalidate the path to update the frontend
  revalidatePath(path)
}