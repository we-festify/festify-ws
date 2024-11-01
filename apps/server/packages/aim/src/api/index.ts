import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the AIM API');
});

// users
import usersRouter from './routes/users';
router.use('/users', usersRouter);

// policies
import policiesRouter from './routes/policies';
router.use('/policies', policiesRouter);

export default router;
