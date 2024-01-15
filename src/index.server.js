const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const { urlencoded } = require('body-parser');
const {sequelize} = require('./models/index') // Make sure to import your Sequelize instance
const app = express();

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'))

// To get environment variable
dotenv.config({ path: './config.env' });

const PORT = process.env.Port;

// Setting up router
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie')

// All the routes are used here.
app.use(authRoutes);
app.use(movieRoutes)

// Sync Sequelize models with the database
sequelize
  .sync({force: false})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Your app is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync Sequelize models:', error);
  });
