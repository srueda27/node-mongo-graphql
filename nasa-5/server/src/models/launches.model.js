const launches = require('./launches.mongo');

const launchesLocal = new Map();
let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Test',
  rocket: 'Explorer',
  launchDate: new Date('12/27/2030'),
  target: 'Kepler',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true
}

launchesLocal.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launchesLocal.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launchesLocal.set(latestFlightNumber, Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  }));
}

function existsLaunchWithId(launchId) {
  return launchesLocal.has(launchId);
}

function abortLaunchById(launchId) {
  const aborted = launchesLocal.get(launchId);

  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}
