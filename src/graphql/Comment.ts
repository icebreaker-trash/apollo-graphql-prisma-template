import { objectType, list } from 'nexus'
import { Comment } from 'nexus-prisma'
export const CommentType = objectType({
  name: Comment.$name,
  definition(t) {
    t.field(Comment.id)
    t.field(Comment.content)

    t.field(Comment.articleId)
    t.field(Comment.userId)
    t.field(Comment.user)
    t.field(Comment.article)
  }
})
