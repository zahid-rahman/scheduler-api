// swagger.js
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scheduler API',
      version: '1.0',
      description: 'A simple Scheduler API with Swagger documentation',
    },
  },
  servers: [
    {
      url: 'http://localhost:3003',
    },
  ],
  apis: ['./src/app/modules/*/*.route.js'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export {
    specs,
    swaggerUi
}