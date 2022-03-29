const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const {
    mission,
    target,
    rocket,
    launchDate
  } = req.body;

  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({
      error: 'Missing required launch property',
    })
  }

  const properLaunchDate = new Date(launchDate);

  if (isNaN(properLaunchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    })
  }

  const launch = {
    mission,
    target,
    rocket,
    launchDate: properLaunchDate
  }

  addNewLaunch(launch);

  return res.status(201).json(launch);
}

function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id);

  if(!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }  

  const aborted = abortLaunchById(launchId);

  return res.status(200).json(aborted)
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch
}