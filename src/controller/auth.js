const jwt = require('jsonwebtoken')
const { Op, where } = require('sequelize');
const {Users} = require('../models')
// modals
// const User = db.Users

exports.signup = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    // Check if the user already exists
    const existingUser = await Users.findOne({ where: { email: { [Op.eq]: email } } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    // Create a new user without permissions
    const newUser = await Users.create({
      name,
      email,
      password
    });
    console.log('New User:', newUser.dataValues);

    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.signin = async (req, res) => {
  try 
  {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Users.findOne( {where: { email: { [Op.eq]: email } } } );
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    if (user.password !== password)
    {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET, {expiresIn: '6h'})

    console.log("User found in Backend",user);

    res.status(200).json({ message: 'User signed in successfully', user,token });
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

