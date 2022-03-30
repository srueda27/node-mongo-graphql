const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch);

  return res.status(201).json(launch);
}

async function httpDeleteLaunch(req, res) {
  const launchId = Number(req.params.id);

  const launchExists = await existsLaunchWithId(launchId);

  if(!launchExists) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }  

  const aborted = await abortLaunchById(launchId);

  if(aborted) {
    return res.status(200).json({
      ok: true
    });
  } else {
    return res.status(500).json({
      error: 'Launch not aborted'
    });
  }

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpDeleteLaunch
}