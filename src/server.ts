import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'

const app = fastify()
const prisma = new PrismaClient()

app.get('/user', async () => {
  const users = await prisma.user.findMany()

  return users
})

app
  .listen({
    port: 3000,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(' 🛩️  HTTP server listening on port http://localhost:3000')
  })
