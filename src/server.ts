import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import history from 'connect-history-api-fallback'
import { config } from 'dotenv'
import { cleanupJob } from './jobs/cleanup.job'

config()
const PORT = process.env.PORT ?? 8080

const app: Application = express()
app.use(express.json())
app.use(cors())

/** API routes must come before static */
app.use('/api', require('./routers/auth.router').default)
app.use('/api', require('./routers/user.router').default)

/** Default to static route */
const staticMiddleware = express.static('.dist')
app.use(staticMiddleware)
app.use(
  history({
    disableDotRule: true,
    verbose: true
  })
)
app.use(staticMiddleware)

/** Start the server */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
  cleanupJob.start()
})
