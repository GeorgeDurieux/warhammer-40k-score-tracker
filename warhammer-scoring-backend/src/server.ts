import app from './app'
import prisma from './prisma'
import logger from './logger/logger' 

const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    await prisma.$connect()
    logger.info('Database connected successfully') 

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`) 
    })
  } catch (err: any) {
    logger.error(`Database connection failed: ${err.message}`) 
    process.exit(1)
  }
}

startServer()
