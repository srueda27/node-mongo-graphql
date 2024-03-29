const axios = require('axios');
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
    console.log('Launches Loaded');

    return;
  }

  const response = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  if (response.status != 200) {
    throw new Error('Launch data failed');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];

    const customers = payloads.flatMap(payload => {
      return payload['customers']
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    }

    await saveLaunch(launch);
  }

  console.log('Launches Loaded')
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find({}, {
      '_id': 0,
      '__v': 0
    })
    .sort({
      flightNumber: 'asc'
    })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    {
      upsert: true
    }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

  if (latestLaunch) {
    return latestLaunch.flightNumber;
  } else {
    return DEFAULT_FLIGHT_NUMBER;
  }
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });

  if (planet) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
      flightNumber: newFlightNumber,
      customers: ['ZTM', 'NASA'],
      upcoming: true,
      success: true
    });

    await saveLaunch(newLaunch);
  } else {
    throw new Error('No matching planet was found')
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  });

  return aborted.modifiedCount == 1;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}
