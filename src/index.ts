import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { createContext, prisma } from './context'
import { makeSchema } from 'nexus'
import { join } from 'path'

import { User, Article, Comment, Prisma } from '@prisma/client'
// import { rule } from './complexity'
import { getFields } from './fields'
import fs from 'fs'
// import depthLimit from 'graphql-depth-limit-ts'
// import { fileURLToPath } from 'node:url'
import {
  ArticleType,
  CommentType,
  QueryType,
  TagType,
  TopicType,
  UserType
} from './graphql'

// const __dirname = dirname(fileURLToPath(import.meta.url))

export const schema = makeSchema({
  types: [ArticleType, CommentType, QueryType, TagType, TopicType, UserType], // 1
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql') // 3
  },
  // contextType: {
  //   module: require.resolve('./context'),
  //   export: 'Context'
  // },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma'
      }
    ]
  }
})

const nexusServer = new ApolloServer({
  schema
})

async function bootstrap() {
  const { url: nexusServerUrl } = await startStandaloneServer(nexusServer, {
    listen: { port: 4000 },
    context: createContext
  })

  console.log(`🚀 Nexus Server ready at: ${nexusServerUrl}`)

  const normalServer = new ApolloServer({
    typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
    resolvers: {
      // prisma
      // The `select` statement for type Comment needs at least one truthy value.
      Query: {
        allUsers(_, args, contextValue, info) {
          const fields = getFields<Prisma.UserSelect>(info)

          return prisma.user.findMany({
            select: {
              id: true,
              name: Boolean(fields.name)
            }
          })
        },
        allArticles(_, args, contextValue, info) {
          const fields = getFields<Prisma.ArticleSelect>(info)
          const commentFields = fields.comments?.fieldsByTypeName.Comment

          const select: Prisma.ArticleSelect = {
            id: true,
            content: Boolean(fields.content),
            title: Boolean(fields.title),
            userId: Boolean(fields.userId || fields.user)
          }
          if (commentFields) {
            select.comments = {
              select: {
                id: true,
                content: Boolean(commentFields.content)
              }
            }
          }
          return prisma.article.findMany({
            select
          })
        },
        allComments(_, args, contextValue, info) {
          const fields = getFields<Prisma.CommentSelect>(info)

          return prisma.comment.findMany({
            select: {
              id: true,
              content: Boolean(fields.content),
              articleId: Boolean(fields.articleId || fields.article),
              userId: Boolean(fields.userId || fields.user)
            }
          })
        }
      },
      User: {
        comments(parent: User, args, contextValue, info) {
          const fields = getFields<Prisma.CommentSelect>(info)

          return prisma.comment.findMany({
            select: {
              id: true,
              articleId: Boolean(fields.articleId || fields.article),
              content: Boolean(fields.content),
              userId: Boolean(fields.userId || fields.user)
            },
            where: {
              userId: parent.id
            }
          })
        }
      },
      Article: {
        comments(
          parent: Prisma.ArticleGetPayload<{
            include: {
              comments: true
            }
          }>,
          args,
          contextValue,
          info
        ) {
          if (parent.comments) {
            return parent.comments
          }
          const fields = getFields<Prisma.CommentSelect>(info)

          return prisma.comment.findMany({
            select: {
              id: true,
              articleId: Boolean(fields.articleId || fields.article),
              content: Boolean(fields.content),
              userId: Boolean(fields.userId || fields.user)
            },
            where: {
              articleId: parent.id
            }
          })
        }
      },
      Comment: {
        article(parent: Comment, args, contextValue, info) {
          const fields = getFields<Prisma.ArticleSelect>(info)

          return prisma.article.findUnique({
            select: {
              id: true,
              content: Boolean(fields.content),
              title: Boolean(fields.title),
              userId: Boolean(fields.userId || fields.user)
            },
            where: {
              // 不能是 undefined , 关系相关的id，是必须要按需取的
              id: parent.articleId
            }
          })
        },
        user(parent: Comment, args, contextValue, info) {
          const fields = getFields<Prisma.UserSelect>(info)

          return prisma.user.findUnique({
            select: {
              id: true,
              name: Boolean(fields.name)
            },
            where: {
              id: parent.userId
            }
          })
        }
      }
    }
    // validationRules: [rule] // depthLimit(10)
  })

  const { url: normalServerUrl } = await startStandaloneServer(normalServer, {
    listen: { port: 4001 },
    context: createContext
  })

  console.log(`🚀 Normal Server ready at: ${normalServerUrl}`)
}

bootstrap()
