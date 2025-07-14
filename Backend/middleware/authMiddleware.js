const jwt = require('jsonwebtoken');

const middleware = async(req,res ) => {
    const token = req.headers.authentication;
    if(!token){
        return res.status(401).json({message: 'No token provided'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({message: 'Invalid token'});
    }
}

module.exports = middleware;


