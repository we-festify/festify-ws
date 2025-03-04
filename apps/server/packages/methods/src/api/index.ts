import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the Methods API');
});

// action execution routes
import handlerRoutes from './routes/handlers';
router.use('/execute', handlerRoutes);

export default router;
