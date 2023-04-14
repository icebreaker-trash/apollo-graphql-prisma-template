import { objectType } from 'nexus'
// import { prisma } from '../context'
// import { GraphQLResolveInfo } from 'graphql'
import { User } from 'nexus-prisma'
export const UserType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    // console.log(User)
    t.field(User.id)
    t.field(User.name)
    t.field(User.articles)
    t.field(User.comments)
    // t.int('id') // <- Field named `id` of type `Int`
    // t.string('name') // <- Field named `title` of type `String`
    // t.field('articles', {
    //   type: list('Article')
    // })
    // t.field('comments', {
    //   type: list('Comment'),
    //   async resolve(parent, args, context, info: GraphQLResolveInfo) {
    //     // info.parentType.name === 'User'
    //     if (parent.comments) {
    //       return parent.comments
    //     }
    //     const res = await prisma.comment.findMany({
    //       where: {
    //         userId: parent.id
    //       }
    //     })
    //     return res
    //   }
    //   // resolve(p){
    //   //   console.log(p)
    //   // }
    // })
    // t.string('body')       // <- Field named `body` of type `String`
    // t.boolean('published') // <- Field named `published` of type `Boolean`
  }
})
