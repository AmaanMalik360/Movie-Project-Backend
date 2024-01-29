const express = require('express');
const { createMovie, editMovie, getAllMovies, toggleFavouriteMovie, getAllFavourites, deleteMovie } = require('../controllers/movie');
const { requireSignin, checkPermissions } = require('../middlewares/authorization');
const { uploadImage } = require('../middlewares/FileUpload');
const { writePermission, editPermission, deletePermission } = require('../middlewares/Permissions');
const router = express.Router()

router.post('/', requireSignin, checkPermissions, writePermission, uploadImage.single('file'), createMovie ); 
router.patch('/:id', requireSignin, checkPermissions, editPermission, uploadImage.single('file'), editMovie ); // id is movieId
router.delete('/:movieId', requireSignin, checkPermissions, deletePermission, deleteMovie ); // id is movieId
router.get('/', requireSignin, getAllMovies)
router.post('/toggle-favourites', requireSignin, toggleFavouriteMovie);
router.get('/favourites/:id', requireSignin, getAllFavourites); // id is userId

module.exports = router