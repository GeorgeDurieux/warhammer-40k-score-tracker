import express from 'express'
import matchRoutes from './routes/matchRoutes'
import armyRoutes from './routes/armyRoutes'
import detachmentRoutes from './routes/detachmentRoutes'
import authRoutes from './routes/authRoutes'
import loggerRoutes from './routes/loggerRoutes'
import cors from 'cors'
import morgan from 'morgan'
import logger from './logger/logger'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// JSON parser
app.use(express.json())

// Morgan for successful requests (info logs)
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) }
}))

// Morgan for failed requests (error logs)
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) }
}))

// Routes
app.use('/api/matches', matchRoutes)
app.use('/api/armies', armyRoutes)
app.use('/api/detachments', detachmentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/log', loggerRoutes)

app.get('/', (req, res) => {
  res.send('WH40K backend is live!')
})

app.use(errorHandler)

export default app
