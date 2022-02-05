const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function verifyToken (req, res, next) {
    try {
        const secret = process.env.JWT_SECRET;
        
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        console.log(decoded.userId);
        req.userId = decoded.userId;
        next();

    } catch(error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Auth failed"
        });
    }
}

module.exports = { verifyToken };