import { objectType, list } from 'nexus'
import { prisma } from '../context'
import { getFields } from '../fields'
import { User, Article, Comment } from 'nexus-prisma'
export const QueryType = objectType({
  name: 'Query',
  definition(t) {
    t.field('allUsers', {
      type: list(User.$name),
      async resolve(parent, args, ctx, info) {
        // parent is undefined

        const fields = getFields<User>(info)
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
    t.field('allArticles', {
      type: list(Article.$name),
      async resolve(parent, args, ctx, info) {
        // parent is undefined
        const fields = getFields<Article>(info)
        const res = await prisma.article.findMany({
          select: {
            // _count: true,
            id: Boolean(fields.id),
            content: Boolean(fields.content)
          }
        })
        return res
      }
    })
    t.field('allComments', {
      type: list(Comment.$name),
      async resolve(parent, args, ctx, info) {
        // parent is undefined
        const fields = getFields<Comment>(info)
        const res = await prisma.comment.findMany({
          select: {
            // _count: true,
            id: Boolean(fields.id),
            content: Boolean(fields.content)
          }
        })
        return res
      }
    })
  }
})
