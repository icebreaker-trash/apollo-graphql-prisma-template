import { objectType, list } from 'nexus'

export const TopicType = objectType({
  name: 'Topic',
  definition(t) {
    t.int('id')
    t.string('name')
    t.int('articleId')

    t.field('article', {
      type: 'Article'
    })
  }
})
