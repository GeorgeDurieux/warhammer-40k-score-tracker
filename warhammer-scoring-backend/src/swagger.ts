import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Warhammer Score Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Warhammer scoring app'
    },
    servers: [
      {
        url: 'http://localhost:4000', 
      },
    ],
  },

  apis: ['./src/routes/*.ts'] 
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
