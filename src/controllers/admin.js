const { Op, where } = require('sequelize');
const {Users, UserPermissions, Permissions } = require('../models')
const { sendEmail } = require('../helpers/email');

exports.getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await Users.findAll();
      // Send the users in the response
      res.status(200).json({ users });
    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.changePermission = async (req, res) => {
  try {
    const { userId, permissionId } = req.body;
    const adminId = req.params.id;

    // Check if the user who is sending the request is loggedIn
    if (adminId != req.userId) 
      return res.status(401).json({ message: "Unauthorized. Can't Access" });

    // and also check if he is an admin
    const admin = await Users.findByPk(adminId);
    if (!admin?.isAdmin) 
      return res.status(403).json({ message: "Unauthorized. Can't Access" });

    // Check if userId whose permission we are about to change (1) exists (2) is admin. If any of them then return
    const userToUpdate = await Users.findByPk(userId);
    if (!userToUpdate || userToUpdate.isAdmin) 
      return res.status(403).json({ message: 'Cannot change permissions for Admin users.' });
    
    // Check if the UserPermission already exists
    const existingUserPermission = await UserPermissions.findOne({
      where: { userId: userId, permissionId: permissionId  }
    });

    // Get the permission name based on permissionId
    const permission = await Permissions.findByPk(permissionId);
    const permissionName = permission? permission.name : 'Unknown Permission';

    let to = userToUpdate.email;
    let subject = "Change in Permissions."
    if (existingUserPermission) {
      // If the UserPermission exists, remove it from the UserPermission Collection
      await UserPermissions.destroy({ where: { userId: userId, permissionId: permissionId }});

      // Send mail to user to notify him/her about the change in his/her permission
      let text = `${permissionName} permission has been taken from you. You can no longer ${permissionName} movies.`
      sendEmail(to, subject, text);

      res.status(200).json({ message: 'Permissions removed successfully' });
    } 
    else {
      // If the UserPermission does not exist, add a new entry to the UserPermission Collection
      await UserPermissions.create({ userId: userId, permissionId: permissionId });

      // Send mail to user to notify him/her about the change in his/her permission
      let text = `You have been granted ${permissionName} permission. You can now ${permissionName} movies.`
      sendEmail(to, subject, text);

      res.status(200).json({ message: 'Permissions added successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllUserPermissions = async (req, res) => {
    try {
      // Fetch all userPermissions from the database
      const userPermissions = await UserPermissions.findAll();
      res.status(200).json({ userPermissions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
exports.getAllPermissions = async (req, res) => {
    try {
      // Fetch all permissions from the database
      const permissions = await Permissions.findAll();
      res.status(200).json({ permissions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
};