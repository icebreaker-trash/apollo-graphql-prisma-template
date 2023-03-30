import { objectType, list } from 'nexus'
import { prisma } from '../context.js'
import { GraphQLResolveInfo } from 'graphql'

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.int('id') // <- Field named `id` of type `Int`
    t.string('name') // <- Field named `title` of type `String`
    t.field('articles', {
      type: list('Article')
    })
    t.field('comments', {
      type: list('Comment'),
      async resolve(parent, args, context, info: GraphQLResolveInfo) {
        // info.parentType.name === 'User'
        if (parent.comments) {
          return parent.comments
        }
        const res = await prisma.comment.findMany({
          where: {
            userId: parent.id
          }
        })
        return res
      }
      // resolve(p){
      //   console.log(p)
      // }
    })
    // t.string('body')       // <- Field named `body` of type `String`
    // t.boolean('published') // <- Field named `published` of type `Boolean`
  }
})
