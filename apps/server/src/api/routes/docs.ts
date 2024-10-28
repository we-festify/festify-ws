import express from 'express';
import { DocsController } from '../controllers/docs';

const router = express.Router();

const docsController = new DocsController();

router.get(
  '/:service',
  docsController.getDocsNavForService.bind(docsController),
);

export default router;
