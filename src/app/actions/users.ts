import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { User } from '@/lib/model';


// Map Prisma user to our User type
const mapPrismaUserToUser = (prismaUser: any): User => ({
  id: prismaUser.id,
  email: prismaUser.email,
  name: prismaUser.name,
  image: prismaUser.image,
  createdAt: prismaUser.createdAt,
  subscription: prismaUser.subscription,
  tokens: prismaUser.tokens,
});

export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(mapPrismaUserToUser);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUser(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return mapPrismaUserToUser(user);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createUser(data: User): Promise<User | { error: string }> {
  try {
    const newUser = await prisma.user.create({
      data: {
        ...data,
        id: data.id,
      },
    });

    return mapPrismaUserToUser(newUser);
  } catch (error) {
    console.error(error);
    return { error: 'Error creating user' };
  }
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | { error: string }> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return mapPrismaUserToUser(updatedUser);
  } catch (error) {
    console.error(error);
    return { error: 'Error updating user' };
  }
}

export async function deleteUser(id: string): Promise<{ error?: string }> {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.id !== session.user.id) {
      return {
        error: 'Unauthorized'
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/')
    return {}
  } catch (error) {
    console.error(error);
    return {
      error: 'Error deleting user'
    }
  }
}
