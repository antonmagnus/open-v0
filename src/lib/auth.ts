import { type DefaultSession } from 'next-auth'
import { NextAuthOptions } from 'next-auth'

import GitHub from 'next-auth/providers/github'
import prisma from './prisma'
import { PrismaAdapter } from "@next-auth/prisma-adapter";

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  providers: [GitHub(
    {
      clientId: (process.env.PROD_GITHUB_ID ?? process.env.DEV_GITHUB_ID) || '',
      clientSecret: (process.env.PROD_GITHUB_SECRET ?? process.env.DEV_GITHUB_SECRET) || '',
    }
  )],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, profile }) {
      // console.log('jwt', profile, token)
      if (profile) {
        token.id = profile.sub
        token.image = profile.image || profile
      }
      return token
    },
    session: ({ session, user }) => {
      //console.log('session', session, user)
      if (user) {
        session.user.id = user.id
        session.user.image = user.image
      }
      return {
        ...session,
      };
    },
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
}