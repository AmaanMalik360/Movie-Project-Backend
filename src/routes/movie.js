const express = require('express');
const { createMovie, editMovie, getAllMovies, toggleFavouriteMovie, getAllFavourites } = require('../controller/movie');
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { requireSignin } = require('../common middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/Images';
        // Create the directory if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})        
const upload = multer({
    storage: storage
})
const router = express.Router()

router.post('/create-movie', requireSignin, upload.single('file'), createMovie ); 

router.patch('/edit-movie/:id', requireSignin, upload.single('file'), editMovie );

router.get('/movies', requireSignin, getAllMovies)

router.post('/toggle-favourite-movie', requireSignin, toggleFavouriteMovie);

router.get('/user-favourites/:id', getAllFavourites);

module.exports = router