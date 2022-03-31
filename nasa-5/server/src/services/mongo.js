require("dotenv").config();
const mongoose = require('mongoose');

const MONGO_URL = `mongodb+srv://nada-api:${process.env.MONGO_PASSWORD}@nasacluster.ga5zg.mongodb.net/nasa?retryWrites=true&w=majority`;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!!');
});

mongoose.connection.on('error', err => {
  console.log(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
} 

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect
};
