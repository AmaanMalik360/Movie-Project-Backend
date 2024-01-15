const jwt = require('jsonwebtoken')
const { Op, where } = require('sequelize');
const {users} = require('../models')
// modals
// const User = db.users

exports.requireSignin = async (req, res, next) => 
{
    console.log("Authorization starts.");

    try 
    {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Authorization Required' });
        }

        const token = req.headers.authorization.split(" ")[1];
        if(!token)
        {
            return res.status(401).json({message: 'Token Required'})
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        console.log(user);
        if(!user)
        {
            return res.status(401).json({ message: 'Unauthorized User' });   
        }

        req.vid = user.id
        console.log("Verification Successful.");
        next();
    } 
    catch (error) 
    {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
};

