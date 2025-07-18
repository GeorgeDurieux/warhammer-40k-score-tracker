import express from 'express'
import matchRoutes from './routes/matchRoutes'
import armyRoutes from './routes/armyRoutes'
import detachmentRoutes from './routes/detachmentRoutes'
import authRoutes from './routes/authRoutes'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))

app.use(express.json())

app.use('/api/matches', matchRoutes)
app.use('/api/armies', armyRoutes)
app.use('/api/detachments', detachmentRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('WH40K backend is live!')
})

export default app