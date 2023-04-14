import { PrismaClient } from '@prisma/client'

export interface Context {
  prisma: PrismaClient
}

export const prisma = new PrismaClient()

export const createContext = async () => ({
  prisma
})
// @ts-ignore
// prisma.$on('query', (e) => {
//   console.log(e)
// })

prisma.$use(async (params, next) => {
  // console.log('This is middleware!')
  // Modify or interrogate params here
  const res = await next(params)
  console.log(params.action, params.model)
  return res
})
