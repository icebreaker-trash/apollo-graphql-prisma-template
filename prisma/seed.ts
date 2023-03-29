import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'icebreaker',
    articles: {
      create: [1, 2, 3, 4, 5].map(x => {
        const content = x.toString().repeat(20)
        const name = x.toString()
        return {
          content,
          title: name,
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
                  },

                }
              },
            ],
            // connectOrCreate:{

            // }
          },
          tags: {
            create: [
              {
                name
              }
            ]
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
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
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
