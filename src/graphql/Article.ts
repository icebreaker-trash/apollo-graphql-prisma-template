import { objectType, list } from 'nexus'
export const Article = objectType({
  name: 'Article',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('content')
    t.int('userId')
    t.field('user', {
      type: 'User'
    })
    t.field('comments', {
      type: list('Comment')
    })
    t.field('topic', {
      type: 'Topic'
    })
    t.field('tags', {
      type: list('Tag')
    })

  },
})