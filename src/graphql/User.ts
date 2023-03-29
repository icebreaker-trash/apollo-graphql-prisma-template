import { objectType } from 'nexus'
export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')            // <- Field named `id` of type `Int`
    t.string('name')      // <- Field named `title` of type `String`
    // t.field('articles',{

    // })
    // t.field('comments')
    // t.string('body')       // <- Field named `body` of type `String`
    // t.boolean('published') // <- Field named `published` of type `Boolean`
  },
})