import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the BES API');
});

// action execution routes
import handlerRoutes from './routes/handlers';
router.use('/execute', handlerRoutes);

// instance routes
import instanceRoutes from './routes/instance';
router.use('/instances', instanceRoutes);

export default router;
