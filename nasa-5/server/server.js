require("dotenv").config();
const http = require('http');

const app = require('./src/app');
const { mongoConnect } = require('./src/services/mongo');
const { loadPlanetsData } = require('./src/models/planets.model');
const { loadLaunchesData } = require('./src/models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();
  
  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
  });
}

startServer();