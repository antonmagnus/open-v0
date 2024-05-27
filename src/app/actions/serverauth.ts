import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// moved here from stream to avoid build error
export const getSession = async () => {
  const session = await getServerSession(authOptions)
  return session
}