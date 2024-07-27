import express from 'express';
const router = express.Router();

// controllers
import DocsController from '../controllers/docs';

router.get('/', DocsController.getDocs);
router.get('/nav', DocsController.getDocsNav);

export default router;
