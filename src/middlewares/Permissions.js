
exports.writePermission = async (req, res, next) =>{
    // Check if the user has write permission
    if(!req.writePermission)
      return res.status(401).json({ message: "Not permitted to add movies" });

    next()
}

exports.editPermission = async (req, res, next) =>{
    // Check if the user has edit permission
    if(!req.editPermission)
      return res.status(401).json({ message: "Not permitted to edit movies" });

    next()
}

exports.deletePermission = async (req, res, next) =>{
    // Check if the user has delete permission
    if (!req.deletePermission)
      return res.status(401).json({ message: "Not permitted to delete movies" });

    next()
}