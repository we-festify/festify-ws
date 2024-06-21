require('dotenv').config({ path: './apps/server/.env' });

const express = require('express');
const cookies = require('cookie-parser');

const app = express();

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
const routes = require('./routes-v1');
app.use('/api/v1', routes);

// Services routes
const servicesRoutes = require('./d-services');
app.use('/api/d', servicesRoutes);

// errors
const { handleErrors } = require('./utils/errors');
app.use(handleErrors);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
