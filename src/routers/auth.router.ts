import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { mailTransport } from '../plugin/mail.plugin'
import dayjs from 'dayjs'
import { z, validate } from '../middleware/zod'

const prisma = new PrismaClient()

const router = Router()

router.get(
  '/verify',
  require('../middleware/verify').default,
  (req: Request, res: Response) => {
    res.status(200).json(req.body.user)
  }
)

router.post(
  '/login',
  validate(
    z.object({
      body: z.object({
        email: z.string(),
        password: z.string()
      })
    })
  ),
  async (req: Request, res: Response) => {
    try {
      prisma.$connect()
      const user = await prisma.user.findUnique({
        where: { email: req.body.email }
      })

      /** User does not exist */
      if (!user) {
        res.status(404).json({
          error: `${req.body.email} is not in our database`
        })
        return prisma.$disconnect()
      }

      const passwords = await prisma.password.findMany({
        where: { user_id: user?.id },
        orderBy: {
          created_at: 'desc'
        },
        take: 1
      })

      /** Wrong password response */
      if (!bcrypt.compareSync(req.body.password, passwords[0].hash)) {
        res.status(401).json({
          error: 'The provided password is incorrect'
        })
        return prisma.$disconnect()
      }
      const expiresAt = dayjs().add(1, 'hour')
      const access_token = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          exp: expiresAt.unix()
        },
        process.env.SECRET!
      )

      const token = await prisma.jwt.create({
        data: {
          user_id: user.id,
          access_token: access_token,
          refresh_token: access_token, // Change later to refresh token
          expires_at: expiresAt.format(),
          scope: 'admin'
        }
      })

      res.status(200).json({
        user_id: user.id,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: token.expires_at,
        scope: token.scope
      })

      return prisma.$disconnect()
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
)

router.post(
  '/logout',
  validate(
    z.object({
      body: z.object({
        email: z.string()
      })
    })
  ),
  async (req: Request, res: Response) => {
    try {
      prisma.$connect()
      const user = await prisma.user.findUnique({
        where: { email: req.body.email }
      })

      /** User does not exist */
      if (!user) {
        res.status(404).json({
          error: `${req.body.email} is not in our database`
        })
        return prisma.$disconnect()
      }

      await prisma.jwt.deleteMany({ where: { user_id: user.id } })

      res.status(200).json({ message: `${user.email} logged out` })
      prisma.$disconnect()
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
)

router.post(
  '/register',
  validate(
    z.object({
      body: z.object({
        email: z.string(),
        password: z.string(),
        first_name: z.string(),
        last_name: z.string()
      })
    })
  ),
  async (req: Request, res: Response) => {
    try {
      prisma.$connect()

      /** Create user record */
      const newUser = await prisma.user.create({
        data: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email
        }
      })

      /** Hash password and associate to the user */
      await prisma.password.create({
        data: {
          hash: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(parseFloat(process.env.SALT!))
          ),
          user_id: newUser.id
        }
      })

      prisma.$disconnect()

      res.status(200).json(newUser)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
)

router.post(
  '/password/reset',
  validate(
    z.object({
      body: z.object({
        email: z.string()
      })
    })
  ),
  async (req: Request, res: Response) => {
    try {
      prisma.$connect()

      const token = Math.floor(100000 + Math.random() * 900000)

      const user = await prisma.user.findUnique({
        where: { email: req.body.email }
      })

      if (!user) {
        res.status(404).json({
          error: `${req.body.email} is not in our database`
        })
        return prisma.$disconnect()
      }

      await prisma.verificationToken.create({
        data: {
          user_id: user?.id,
          token: token,
          expires_at: dayjs().add(10, 'minutes').format()
        }
      })

      prisma.$disconnect()

      await mailTransport.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Verification Code',
        text: `Your password reset code is ${token}`
      })

      res.status(200).json({ message: 'success' })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
)

router.post(
  '/password/confirm',
  validate(
    z.object({
      body: z.object({
        token: z.number(),
        password: z.string()
      })
    })
  ),
  async (req: Request, res: Response) => {
    try {
      prisma.$connect()

      const token = await prisma.verificationToken.findUnique({
        where: { token: req.body.token }
      })

      if (!token) {
        res.status(400).json({ error: 'Invalid verification token' })
        return prisma.$disconnect()
      }

      if (dayjs().isAfter(token.expires_at)) {
        res.status(400).json({ error: 'Token is expired' })
        return prisma.$disconnect()
      }

      const passwords = await prisma.password.findMany({
        where: {
          user_id: token.user_id,
          created_at: {
            gte: dayjs().subtract(30, 'days').format(),
            lt: dayjs().format()
          }
        }
      })

      for (const el of passwords) {
        if (bcrypt.compareSync(req.body.password, el.hash)) {
          prisma.$disconnect()
          return res.status(400).json({
            error:
              'Password cannot be the same as one you used in the last 30 days'
          })
        }
      }

      await prisma.password.create({
        data: {
          hash: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(parseFloat(process.env.SALT!))
          ),
          user_id: token.user_id
        }
      })
      prisma.$disconnect()

      res.status(200).json({ message: 'success' })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }
)

export default router
