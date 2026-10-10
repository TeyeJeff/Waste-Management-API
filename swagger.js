const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Waste Management API',
    description: 'API for managing waste pickup requests, collections, and citizen feedback',
  },
  host: 'waste-management-api-jpaq.onrender.com',
  schemes: ['https', 'http'],
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);