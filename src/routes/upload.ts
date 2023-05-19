import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
const util = require('util')

const pump = util.promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (req, reply) => {
    const upload = await req.file({
      limits: {
        fileSize: 5_242_880,
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    const mineTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mineTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/' + fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = req.protocol.concat('://').concat(req.hostname)

    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
