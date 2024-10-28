import express from 'express';
import { MetaController } from '../controllers/meta';

const router = express.Router();

const metaController = new MetaController();

router.get('/services', metaController.getServicesMeta.bind(metaController));
router.get(
  '/services/:service/actions',
  metaController.getAllowedActionsForService.bind(metaController),
);

export default router;
