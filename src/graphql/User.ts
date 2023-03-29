import { objectType, list } from 'nexus'
export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')            // <- Field named `id` of type `Int`
    t.string('name')      // <- Field named `title` of type `String`
    t.field('articles', {
      type: list('Article')
    })
    t.field('comments', {
      type: list('Comment'),
      // resolve(p){
      //   console.log(p)
      // }
    })
    // t.string('body')       // <- Field named `body` of type `String`
    // t.boolean('published') // <- Field named `published` of type `Boolean`
  },
})