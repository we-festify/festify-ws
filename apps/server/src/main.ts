import * as dotenv from 'dotenv';
dotenv.config({ path: './apps/server/.env' });

import express from 'express';
import cookies from 'cookie-parser';

const app = express();
// Security
app.disable('x-powered-by');

// Cookies
app.use(cookies());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.json({ message: 'Welcome to the application' });
});

// Database
require('./config/db');

// Routes
import routes from './routes-v1';
app.use('/api/v1', routes);

// Services routes
import servicesRoutes from './d-services';
app.use('/api/d', servicesRoutes);

// errors
import { handleErrors } from './utils/errors';
app.use(handleErrors);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
