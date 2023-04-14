import { objectType, list } from 'nexus'
import { Topic } from 'nexus-prisma'
export const TopicType = objectType({
  name: Topic.$name,
  definition(t) {
    t.field(Topic.id)
    t.field(Topic.name)
    t.field(Topic.articleId)
    t.field(Topic.article)
  }
})
