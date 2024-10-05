import express from 'express';

// controllers
import DocsController from '../controllers/docs';

const router = express.Router();

router.get('/', DocsController.getDocs);
router.get('/:service', DocsController.getDocs);
router.get('/nav', DocsController.getDocsNav);
router.get('/nav/:service', DocsController.getDocsNav);

export default router;
