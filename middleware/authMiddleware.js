import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(403).json({message: 'No token provided'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        req.userID = decoded.id; // Set user id to request object
        next(); // Call next middleware or route handler
    })

}

export default authMiddleware;