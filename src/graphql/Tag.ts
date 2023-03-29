import { objectType, list } from 'nexus'
export const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.int('id')
    t.string('name')


    t.field('articles', {
      type: list('Article')
    })


  },
})