// db
const { applicationDB } = require('../config/db');

// models
const Instance = require('@shared/models/Instance')(applicationDB);

const trackApiRequest = async (req, res, next) => {
  try {
    const { _id } = req.instance;

    // instance will always be there
    // already checked in requireAuthByAPIKey middleware
    const instance = await Instance.findById(_id);

    // update instance last api call time and increment api calls
    instance.lastApiCallTime = new Date();
    instance.apiCalls += 1;
    await instance.save();

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { trackApiRequest };
