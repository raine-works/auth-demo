import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { config } from 'dotenv'

config()
const PORT = process.env.PORT ?? 8080

const app: Application = express()
app.use(express.json())
app.use(cors())

app.use('/', require('./routers/auth.router').default)

/** Catch all must be the last route */
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: 'resource no found' })
})

/** Start the server */
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
