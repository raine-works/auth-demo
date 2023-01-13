import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async (req: Request, res: Response, next: NextFunction) => {
	if (
		!req.headers.authorization ||
		!req.headers.authorization.toLowerCase().includes('bearer')
	) {
		res.status(401).json({ error: 'bearer token required' })
	} else {
		prisma.$connect()

		const dbToken = await prisma.jwt.findUnique({
			where: {
				access_token: req.headers.authorization?.split(' ')[1],
			},
		})

		if (!dbToken) {
			res.status(401).json({ error: 'unauthorized' })
		} else {
			jwt.verify(
				dbToken.access_token,
				process.env.SECRET!,
				(err, decoded) => {
					if (err) {
						res.status(401).json({ error: err.message })
					} else {
						req.body.user = {
							...(decoded as object),
							scope: dbToken.scope,
						}
						next()
					}
				}
			)
		}
	}
}
