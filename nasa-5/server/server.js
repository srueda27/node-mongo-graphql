const http = require('http');
const mongoose = require('mongoose');

const app = require('./src/app');
const { loadPlanetsData } = require('./src/models/planets.model')

const PORT = process.env.PORT || 8000;
const MONGO_URL = 'mongodb+srv://nada-api:H1RWmiVAEFGB8Tt8@nasacluster.ga5zg.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!!');
});

mongoose.connection.on('error', err => {
  console.log(err);
})

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  
  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
  });
}

startServer();