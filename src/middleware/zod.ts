import { Request, Response, NextFunction } from 'express'
import { z, AnyZodObject } from 'zod'

export const validate = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			})
			return next()
		} catch (err) {
			return res.status(400).json({ error: err })
		}
	}
}

export { z }
