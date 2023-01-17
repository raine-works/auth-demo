import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { mailTransport } from '../plugin/mail.plugin'
import dayjs from 'dayjs'
import { z, validate } from '../middleware/zod'

const prisma = new PrismaClient()

const router = Router()

router.get(
  '/user/:user_id',
  validate(
    z.object({
      params: z.object({
        user_id: z.string()
      })
    })
  ),
  async (req: Request, res: Response) => {
    try {
      prisma.$connect()

      const user = await prisma.user.findUnique({
        where: { id: req.params.user_id }
      })

      prisma.$disconnect()

      res.status(200).json(user)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
)

export default router
