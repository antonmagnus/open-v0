'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'
import { getSession } from '@/app/actions/serverauth'
import { auth } from '@/auth'
import { Project } from '@/lib/model'

export async function getProjects(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const projects: string[] = await kv.zrange(`user:project:${userId}`, 0, -1, {
      rev: true
    })

    for (const project of projects) {
      pipeline.hgetall(project)
    }

    const results = await pipeline.exec()

    return results as Project[]
  } catch (error) {
    return []
  }
}

export async function getProject(id: string, userId: string) {
  const project = await kv.hgetall<Project>(`project:${id}`)

  if (!project || (userId && project.userId != userId)) {
    return null
  }

  return project
}

export async function removeProject({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  const uid = await kv.hget<string>(`project:${id}`, 'userId')

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`project:${id}`)
  await kv.zrem(`user:project:${session.user.id}`, `project:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearProjects() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const projects: string[] = await kv.zrange(`user:project:${session.user.id}`, 0, -1)
  if (!projects.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const project of projects) {
    pipeline.del(project)
    pipeline.zrem(`user:project:${session.user.id}`, project)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedProject(id: string) {
  const project = await kv.hgetall<Project>(`project:${id}`)
  console.log('project', project)
  if (!project || !project.sharePath) {
    return null
  }

  return project
}

export async function shareProject(project: Project) {
  const session = await getSession()
  console.log('session', session)
  console.log('project', project)
  if (!session?.user?.id || session.user.id != project.userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const payload = {
    ...project,
    sharePath: `/share/${project.id}`
  }

  await kv.hmset(`project:${project.id}`, payload)

  return payload
}
