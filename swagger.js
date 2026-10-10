const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Waste Management API',
    description: 'API for managing waste pickup requests, collections, and citizen feedback',
  },
  // Automatically switch host depending on environment, defaulting to localhost
  host: process.env.NODE_ENV === 'production' 
    ? 'waste-management-api-jpaq.onrender.com' 
    : 'localhost:8080',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);