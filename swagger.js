const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Waste Management API',
    description: 'API for managing waste pickup requests, collections, and citizen feedback',
  },
  host: process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost:8080',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);