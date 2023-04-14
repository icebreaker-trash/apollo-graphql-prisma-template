import { objectType, list } from 'nexus'
import { Article } from 'nexus-prisma'
export const ArticleType = objectType({
  name: Article.$name,
  description: Article.$description,
  definition(t) {
    t.field(Article.comments)
    t.field(Article.content)
    t.field(Article.id)
    t.field(Article.tags)
    t.field(Article.title)
    t.field(Article.topic)
    t.field(Article.user)
    t.field(Article.userId)
  }
})
