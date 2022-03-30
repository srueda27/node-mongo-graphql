const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Test',
  rocket: 'Explorer',
  launchDate: new Date('12/27/2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true
}

saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find({}, {
    '_id': 0,
    '__v': 0
  });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (planet) {
    await launches.findOneAndUpdate({
      flightNumber: launch.flightNumber
    },
    launch,{
      upsert: true
    })
  } else {
    throw new Error('No matching planet was found')
  }
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (latestLaunch) {
    return latestLaunch.flightNumber;
  } else {
    return DEFAULT_FLIGHT_NUMBER;
  }
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  
  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  });

  await saveLaunch(newLaunch)
}

async function existsLaunchWithId(launchId) {
  return await launches.findOne({
    flightNumber: launchId
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId
  },{
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount == 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}
