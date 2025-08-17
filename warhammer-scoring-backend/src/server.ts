import app from './app'
import prisma from './prisma'

const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Database connection failed:', err)
    process.exit(1)
  }
}

startServer()
