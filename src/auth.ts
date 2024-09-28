import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import database from './db'
import { PrismaAdapter } from '@auth/prisma-adapter'
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(database),
  providers: [Google],
})
