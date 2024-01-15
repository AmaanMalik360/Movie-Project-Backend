const mongoose = require('mongoose');
// const Permission = require('../models/Permission');
const dotenv = require('dotenv') 

const DB_URL = process.env.Database

mongoose.connect('mongodb+srv://amaanmalik0360:practiceproject@cluster1.nswtctw.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log( 'MONGO CONNECTION OPEN!!!');
    })
    .catch((err) => {
       console.log(err);
    });

 const seedProducts = [
    {
        name: 'Write',
    },
    {
        name: 'Edit',
    },
    {
        name: 'Delete',
    }
 ];

const seedDB = async () =>{   
    await Permission.deleteMany({});
    await Permission.insertMany(seedProducts);
}
 
seedDB().then(() => {
    mongoose.connection.close();
})