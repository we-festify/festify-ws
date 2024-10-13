import express from 'express';

const router = express.Router();

import { DocsController } from '../controllers/docs';
const docsController = new DocsController();

router.get(
  '/:service',
  docsController.getDocsNavForService.bind(docsController),
);

export default router;
