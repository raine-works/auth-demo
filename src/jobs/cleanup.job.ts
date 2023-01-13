import { cronJob } from '../plugin/cron.plugin'
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export const cleanupJob = new cronJob('0 0 0 * * *', async () => {
	console.log('Starting clean up job')

	prisma.$connect()

	// Delete old passwords
	const allPasswords = await prisma.password.findMany({
		orderBy: { created_at: 'desc' },
	})
	const passwordsToDelete: string[] = []

	allPasswords.forEach((el, key) => {
		if (dayjs().subtract(30, 'days').isAfter(el.created_at) && key !== 0) {
			passwordsToDelete.push(el.id)
		}
	})

	await prisma.password.deleteMany({
		where: { id: { in: passwordsToDelete } },
	})

	// Delete old JWTs
	await prisma.jwt.deleteMany({
		where: { expires_at: { gte: dayjs().format() } },
	})

	// Delete old verification tokens
	await prisma.verificationToken.deleteMany({
		where: { expires_at: { gte: dayjs().format() } },
	})

	prisma.$disconnect()
})
