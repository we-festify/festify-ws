import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the BES API');
});

// instance routes
import instanceRoutes from './routes/instances';
router.use('/instances', instanceRoutes);

// email template routes
import emailTemplateRoutes from './routes/email-templates';
router.use('/templates', emailTemplateRoutes);

// action execution routes
import handlerRoutes from './routes/handlers';
router.use('/execute', handlerRoutes);

export default router;
