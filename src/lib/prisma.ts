// import { Pool, neonConfig } from '@neondatabase/serverless'
// import ws from 'ws'
// import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

declare global {
  namespace NODEJS {
    interface Global { }
  }
}
interface CUSTOMNODEJSGLOBAL extends NODEJS.Global {
  prisma: PrismaClient;
}

declare const global: CUSTOMNODEJSGLOBAL;
// neonConfig.webSocketConstructor = ws
// const connectionString = `${process.env.POSTGRES_URL}`

// const pool = new Pool({ connectionString })
// const adapter = new PrismaNeon(pool)

const prisma = global.prisma || new PrismaClient({
  adapter: new PrismaNeon(
    new Pool({ connectionString: process.env.POSTGRES_URL })
  )
})
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;