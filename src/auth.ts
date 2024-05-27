import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import prisma from './lib/prisma'
import { createUser } from './app/actions/users'
import { PrismaAdapter } from "@auth/prisma-adapter"

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub(
    {
      clientId: process.env.PROD_GITHUB_ID ?? process.env.DEV_GITHUB_ID,
      clientSecret: process.env.PROD_GITHUB_SECRET ?? process.env.DEV_GITHUB_SECRET,
    }
  )],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.avatar_url || profile
      }
      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.sub as string
        session.user.image = token.image as string
      }
      return {
        ...session,
      };
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})

