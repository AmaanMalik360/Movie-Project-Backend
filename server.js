const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const {sequelize} = require('./src/models/index') // Make sure to import your Sequelize instance
const app = express();

app.use(express.json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'))

// To get environment variable
dotenv.config({ path: './.env' });

const PORT = process.env.PORT;

// Setting up router
const authRoutes = require('./src/routes/auth');
const movieRoutes = require('./src/routes/movie');
const adminRoutes = require('./src/routes/admin')

// All the routes are used here.
app.use(authRoutes);
app.use('/movies',movieRoutes);
app.use('/admin',adminRoutes);

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
