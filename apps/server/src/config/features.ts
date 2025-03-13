import dotenv from 'dotenv';
dotenv.config();

export default {
  festifyAnalogService: process.env.FEATURES_FESTIFY_ANALOG_SERVICE === 'true',
  festifyBridgeService: process.env.FEATURES_FESTIFY_BRIDGE_SERVICE === 'true',
  festifyMethodsService:
    process.env.FEATURES_FESTIFY_METHODS_SERVICE === 'true',
};
