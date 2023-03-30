import { PrismaClient, Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/zh_CN'
const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = new Array(10)
  .fill(0)
  .map((_, idx) => {
    const name = faker.name.fullName()
    return {
      name,
      articles: {
        create: new Array(5).fill(0).map<Prisma.ArticleCreateInput>((_, x) => {
          const content = x + '正文内容:' + faker.random.words(200)
          const title = faker.random.words()

          return {
            content,
            title,
            comments: {
              create: [
                {
                  content,
                  user: {
                    connectOrCreate: {
                      create: {
                        name: 'yyf'
                      },
                      where: {
                        name: 'yyf'
                      }
                    }
                  }
                }
              ]
            },
            // user: {
            //   connect: {
            //     name
            //   }
            // },
            tags: {
              connectOrCreate: {
                create: {
                  name
                },
                where: {
                  name
                }
              }
            },
            topic: {
              create: {
                name
              }
            }
          }
        })
      }
    }
  })

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
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
