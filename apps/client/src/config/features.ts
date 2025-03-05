export default {
  festifyAnalogService:
    import.meta.env.VITE_FEATURES_FESTIFY_ANALOG_SERVICE === 'true',
  festifyBridgeService:
    import.meta.env.VITE_FEATURES_FESTIFY_BRIDGE_SERVICE === 'true',
  festifyMethodsService:
    import.meta.env.VITE_FEATURES_FESTIFY_METHODS_SERVICE === 'true',
};
