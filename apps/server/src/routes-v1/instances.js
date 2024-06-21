const express = require('express');
const router = express.Router();

const InstancesController = require('../controllers/instances');
const { requireAuth } = require('../middlewares/auth');

router.get('/:serviceType', requireAuth, InstancesController.getInstances);
router.get(
  '/:serviceType/:instanceId',
  requireAuth,
  InstancesController.getInstance
);
router.post('/:serviceType', requireAuth, InstancesController.createInstance);
router.patch(
  '/:serviceType/:instanceId',
  requireAuth,
  InstancesController.updateInstance
);
router.put(
  '/:serviceType/:instanceId/creds',
  requireAuth,
  InstancesController.updateCreds
);

module.exports = router;
