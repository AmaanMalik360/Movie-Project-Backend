const { Op, where, Model } = require('sequelize');

const {FavouriteMovies, Movies, Users} = require('../models')
// modals

exports.createMovie = async (req, res) => {
  try {
    const { name, year} = req.body;

    // Check if the movie already exists
    const existingMovie = await Movies.findOne({ where: { name: { [Op.eq]: name } } });
    if (existingMovie) {
      return res.status(409).json({ message: 'Movie already exists' });
    }
    // Create a new movie without permissions
    const newMovie = await Movies.create({
      name,
      year,
      image: req.file.filename
    });
    console.log('New Movie:', newMovie.dataValues);

    res.status(201).json({ message: 'Movie created successfully', newMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.editMovie = async (req, res) => {
  try {
    const { name, year } = req.body;

    // Find the movie by ID
    const movieId = req.params.id; // Assuming you have the movieId in the request parameters
    const movie = await Movies.findByPk(movieId);

    // Check if the movie exists
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let updatedFields = [];

    // Update only the fields that are present in the request body
    if (name !== undefined) {
      movie.name = name;
      updatedFields.push('name');
    }
    if (year !== undefined) {
      movie.year = year;
      updatedFields.push('year');
    }

    // Update the image only if a new file is uploaded
    if (req.file) {
      movie.image = req.file.filename;
      updatedFields.push('image');
    }

    // Save the changes to the database
    await movie.save();

    // Check if any fields were updated
    if (updatedFields.length === 0) {
      return res.status(200).json({ message: 'Nothing to update', movie });
    }

    res.status(200).json({ message: 'Movie updated successfully', updatedFields, movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllMovies = async (req, res) => {
    try {
      // Fetch all Movies from the database
      const allMovies = await Movies.findAll();
  
      res.status(200).json({ Movies: allMovies });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
};


exports.toggleFavouriteMovie = async (req, res) => {
    try {
      const { userId, movieId } = req.body;
  
      // Check if the user exists
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the movie exists
      const movie = await Movies.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      // Check if the movie is already in the user's favorites
      const existingFavourite = await FavouriteMovies.findOne({
        where: {
          userId: userId,
          movieId: movieId,
        },
      });
  
      if (existingFavourite) {
        // If the movie is already in favorites, remove it
        await existingFavourite.destroy();
        res.status(200).json({ message: 'Movie removed from favorites', userId, movieId });
      } 
      else {
        // If the movie is not in favorites, add it
        const newFavourite = await FavouriteMovies.create({
          userId: userId,
          movieId: movieId,
        });
        res.status(201).json({ message: 'Movie added to favorites', userId, movieId, newFavourite });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllFavourites = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if the user exists
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch all favourites of the user including movie details
      const userFavourites = await FavouriteMovies.findAll({
        where: { userId: userId },
        // include: Movies
        include: [{ model: Movies, attributes: ['name', 'year', 'image'] }],
      });
  
      res.status(200).json({ favourites: userFavourites });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
};
