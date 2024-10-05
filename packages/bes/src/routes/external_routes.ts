import express from 'express';
const router = express.Router();
import cors from 'cors';

// dynamic cors origin
router.use(
  cors({
    origin: '*', // allow all origins - will be checked in requireAuthByAPIKey
  })
);

export default router;
