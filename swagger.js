const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Waste Management API',
    description: 'API for managing waste pickup requests, collections, and citizen feedback',
    version: '1.0.0'
  },
  host: 'waste-management-api-jpaq.onrender.com',
  schemes: ['https', 'http'],
  definitions: {
    CollectionInput: {
      wasteRequestId: "650c1f1f1f1f1f1f1f1f1f1f",
      collectorId: "650c1f1f1f1f1f1f1f1f1f1f",
      scheduledDate: "2026-10-15T10:00:00.000Z",
      status: "Scheduled"
    },
    FeedbackInput: {
      userId: "650c1f1f1f1f1f1f1f1f1f1f",
      collectionId: "650c1f1f1f1f1f1f1f1f1f1f",
      rating: 5
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('./server.js'); // ensures generation finishes
});