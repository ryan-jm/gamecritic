const express = require('express');
const cors = require('cors');
const { auth, errorHandler } = require('./middleware');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(auth);
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
