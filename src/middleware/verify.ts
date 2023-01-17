import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { getCookieByName } from '../plugin/cookie.plugin'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization && !req.headers.cookie) {
    res.status(401).json({ error: 'bearer token required' })
  } else {
    prisma.$connect()

    const dbToken = await prisma.jwt.findUnique({
      where: {
        access_token: req.headers.cookie
          ? getCookieByName('access_token', req.headers.cookie)
          : req.headers.authorization?.split(' ')[1]
      }
    })

    prisma.$disconnect()

    if (!dbToken) {
      res.status(401).json({ error: 'unauthorized' })
    } else {
      jwt.verify(dbToken.access_token, process.env.SECRET!, (err, decoded) => {
        if (err) {
          res.status(401).json({ error: err.message })
        } else {
          req.body.user = {
            ...(decoded as object),
            scope: dbToken.scope
          }
          next()
        }
      })
    }
  }
}
