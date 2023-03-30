import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { createContext } from './context.js'
import { makeSchema } from 'nexus'
import { join, dirname } from 'path'
import { fileURLToPath } from 'node:url'
import {
  ArticleType,
  CommentType,
  QueryType,
  TagType,
  TopicType,
  UserType
} from './graphql/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const server = new ApolloServer({
  schema
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: createContext
})

console.log(`🚀  Server ready at: ${url}`)
