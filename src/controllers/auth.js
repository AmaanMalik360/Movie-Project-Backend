const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize");
const { Users, Permissions, UserPermissions } = require("../models");
const { sendEmail } = require("../helpers/email");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let isAdmin = false;

    // Check if the user already exists
    const existingUser = await Users.findOne({ where: { email: { [Op.eq]: email } }});
    if (existingUser) 
      return res.status(409).json({ message: "User already exists" });
    
    // Create a new user without permissions
    const newUser = await Users.create({ name, email, password, isAdmin });

    // Find the three permissions.
    const writePermission = await Permissions.findOne({
      where: { name: "Write" },
    });
    const editPermission = await Permissions.findOne({
      where: { name: "Edit" },
    });
    const deletePermission = await Permissions.findOne({
      where: { name: "Delete" },
    });

    // Create three new userPermissions
    const writeUserPermission = await UserPermissions.create({
      userId: newUser.id,
      permissionId: writePermission.id,
    });
    const editUserPermission = await UserPermissions.create({
      userId: newUser.id,
      permissionId: editPermission.id,
    });
    const deleteUserPermission = await UserPermissions.create({
      userId: newUser.id,
      permissionId: deletePermission.id,
    });

    let to = newUser.email;
    let subject = "Registration with Movies Corner.";
    let text = "You just signed up with Movies Corner. ";
    sendEmail(to, subject, text);

    //  console.log('New User:', newUser);
    res.status(201).json({ message: "User registered successfully", newUser });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const existingUser = await Users.findOne({ where: { email: { [Op.eq]: email } } });
    if (!existingUser)
      return res.status(401).json({ message: "Invalid credentials" });
    
    // Check if the password is correct
    if (existingUser.password !== password) 
      return res.status(401).json({ message: "Invalid credentials" });

    // Find UserPermissions associated with the user
    const userPermissions = await UserPermissions.findAll({ where: { userId: existingUser.id }, include: [{ model: Permissions, attributes: ["name"] }] });

    // Extract permission names from the found UserPermissions
    const permissionNames = userPermissions.map(
      (userPermission) => userPermission.Permission.name
    );

    // Create a JWT token
    const token = jwt.sign( { id: existingUser.id, permissions: permissionNames }, process.env.JWT_SECRET, { expiresIn: "6h" });
    let user = {
      name: existingUser.name,
      email: existingUser.email,
      id: existingUser.id,
      isAdmin: existingUser.isAdmin
    }
    // console.log("User found in Backend", user);
    res.status(200).json({ message: "User signed in successfully", user, token });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};