import { objectType, list } from 'nexus'
import { Tag } from 'nexus-prisma'
export const TagType = objectType({
  name: Tag.$name,
  description: Tag.$description,
  definition(t) {
    t.field(Tag.id)
    t.field(Tag.name)
    t.field(Tag.articles)
  }
})
