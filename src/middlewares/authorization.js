const jwt = require('jsonwebtoken')
const {Users, UserPermissions, Permissions } = require('../models')

exports.requireSignin = async (req, res, next) => {
    console.log("Authorization starts.");
    try {
        if (!req.headers.authorization) 
            return res.status(401).json({ message: 'Authorization Required' });

        const token = req.headers.authorization.split(" ")[1];
        if(!token)
            return res.status(401).json({message: 'Token Required'})
        
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log(user);

        if(!user)
            return res.status(401).json({ message: 'Unauthorized User' });   
        req.user = user
        console.log("Verification Successful.");
        next();
    } 
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }    
};

exports.checkPermissions = async (req, res, next) => {
    // console.log("Checking permissions.");
    try {
        const user = req.user;
        // Set flags in req object based on user's permissions
        for (const permissionName of user.permissions) {
            const permission = await Permissions.findOne({ name: permissionName });

            if (permission) {
                const userPermission = await UserPermissions.findOne({
                    userId: user.id,
                    permissionId: permission.id
                });

                if (userPermission) {
                    // Set flags in req object based on permission
                    req[`${permissionName.toLowerCase()}Permission`] = true;
                } 
                else {
                    console.log(`User does not have permission: ${permissionName}`);
                }
            } 
            else {
                console.log(`Permission not found: ${permissionName}`);
            }
        }
        req.userId = user.id
        req.user = null;
        // console.log("Permission check completed.");
        next();
    } 
    catch (error) {
        console.error('Error checking permissions:', error);
        return res.status(500).json({ message: 'Server Error.' });
    }
};
