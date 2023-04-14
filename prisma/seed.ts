import { PrismaClient, Prisma, Tag, User } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/zh_CN'
const prisma = new PrismaClient()

const tags: Prisma.TagCreateInput[] = [
  {
    name: '随笔'
  },
  {
    name: '技术'
  },
  {
    name: '宗教'
  },
  {
    name: '生活'
  },
  {
    name: '风景'
  }
]

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'icebreaker'
  },
  {
    name: '大聪明'
  },
  {
    name: '卧龙'
  },
  {
    name: '凤雏'
  }
]
// https://www.prisma.io/docs/concepts/components/prisma-schema/relations/self-relations
async function main() {
  return await prisma.$transaction(async (prisma) => {
    console.log(`Start seeding ...`)
    const tagArray: Tag[] = []
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      tagArray.push(
        await prisma.tag.create({
          data: tag
        })
      )
    }

    console.log(`Create Tags finished.`)
    const userArray: User[] = []
    for (const u of userData) {
      const user = await prisma.user.create({
        data: u
      })
      console.log(`Created user with id: ${user.id}`)
      userArray.push(user)
    }

    const icebreaker = userArray[0]

    const article0 = await prisma.article.create({
      data: {
        content: faker.random.words(2000),
        title: faker.random.words(10),
        userId: icebreaker.id,
        tags: {
          connect: [
            {
              // 唯一索引
              name: tagArray[0].name
            },
            {
              id: tagArray[1].id
            }
          ]
        },
        topic: {
          create: {
            name: 'icebreaker 超话'
          }
        }
      }
    })

    const article1 = await prisma.article.create({
      data: {
        content: faker.random.words(2000),
        title: faker.random.words(10),
        userId: icebreaker.id,
        tags: {
          connect: [
            {
              // 唯一索引
              name: tagArray[2].name
            },
            {
              id: tagArray[3].id
            }
          ]
        },
        topic: {
          create: {
            name: 'hello world'
          }
        }
      }
    })

    const article2 = await prisma.article.create({
      data: {
        content: faker.random.words(2000),
        title: faker.random.words(10),
        userId: icebreaker.id,
        tags: {
          connect: [
            {
              // 唯一索引
              name: tagArray[4].name
            }
          ]
        },
        topic: {
          create: {
            name: 'ts 教程'
          }
        }
      }
    })
    const articles = [article0, article1, article2]
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      for (let j = 0; j < userArray.length; j++) {
        const u = userArray[j]
        await prisma.comment.create({
          data: {
            content: faker.random.words(10),
            articleId: article.id,
            userId: u.id
          }
        })
      }
    }
    console.log(`Seeding finished.`)
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
