import { auth } from '@/auth'

// moved here from stream to avoid build error
export const getSession = async () => {
  const session = await auth()
  return session
}