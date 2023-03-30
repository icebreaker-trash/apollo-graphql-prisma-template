import { objectType, list } from 'nexus'
import { prisma } from '../context.js'
import { parse, simplify, ResolveTree } from 'graphql-parse-resolve-info'

export const QueryType = objectType({
  name: 'Query',
  definition(t) {
    t.field('allUsers', {
      type: list('User'),
      async resolve(parent, args, ctx, info) {
        // parent is undefined
        const parsedResolveInfoFragment = parse(info) as ResolveTree
        const { fields } = simplify(parsedResolveInfoFragment, info.returnType)
        const res = await prisma.user.findMany({
          select: {
            // _count: true,
            id: Boolean(fields.id),
            name: Boolean(fields.name)
          }
        })
        return res
      }
    })
  }
})
