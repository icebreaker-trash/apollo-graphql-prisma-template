import { objectType, list } from 'nexus'
import { prisma } from '../context.js'
export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('allUsers', {
      type: list('User'),
      resolve(parent, args, ctx, info) {
        return prisma.user.findMany()
      }
    })
  },
})