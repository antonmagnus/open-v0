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
//use local docker container for development
let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = global.prisma || new PrismaClient({
    adapter: new PrismaNeon(
      new Pool({ connectionString: process.env.POSTGRES_URL })
    )
  })
}
else {
  prisma = global.prisma || new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL
      }
    }
  })
}
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;