import { objectType, list } from 'nexus'
export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.int('id')
    t.string('content')
    t.int('articleId')
    t.int('userId')


    t.field('user', {
      type: 'User'
    })
    t.field('article', {
      type: 'Article'
    })


  },
})