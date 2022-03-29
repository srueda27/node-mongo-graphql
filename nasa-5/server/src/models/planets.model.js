const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');
const planetsLocal = [];

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true
      }))
      .on('data', async data => {
        if (isHabitablePlanet(data)) {
          planetsLocal.push(data);

          // insert + update = upsert
          await planets.create({
            keplerName: data.kepler_name
          });
        }
      })
      .on('error', err => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        console('Data Loaded!')
        resolve();
      });
  });
}

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

async function getAllPlanets() {
  return await planets.find({});
}

module.exports = {
  getAllPlanets,
  loadPlanetsData
};