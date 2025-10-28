import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // I expect the token to be sent in the 'Authorization' header.
    // It usually looks like this: "Bearer eyJhbGciOiJIUzI1NiIsIn..."
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        
        // If the token is valid, I'll call next() to allow the request to proceed.
        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;