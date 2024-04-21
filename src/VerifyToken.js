const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

function verifyToken(req, res, next) {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Nieprawidłowy token. '})
        }

        req.user = decoded
        next()
    })
}

module.exports = { verifyToken };