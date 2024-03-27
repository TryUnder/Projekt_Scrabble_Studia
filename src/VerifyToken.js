const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

function verifyToken(req, res, next) {
    // const cookies = document.cookie.split(';').map(cookie => cookie.trim())
    // const tokenCookie = cookies.find(cookie => cookie.startsWith('token=').split('=')[1])
    //const authHeader = req.headers['authorization']
    //console.log(authHeader)
    //const tokenCookie = (authHeader && authHeader.split(' ')[1]).substring(6);
    //console.log(tokenCookie)

    const token = req.cookies.token;
    console.log("token: ")
    console.log("my token")
    console.log(token)

    // if (!tokenCookie) {
    //     return res.status(401).json({ message: 'Brak autoryzacji.' })
    // }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Nieprawidłowy token. '})
        }

        req.user = decoded
        next()
    })
}

module.exports = { verifyToken };