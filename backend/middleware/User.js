// This is for user validation / authentication after login.       
const { jwtSecret, jwt } = require("../config");

async function userMiddleware(req, res, next) {       // function / Middleware to verify jwt token. Tested for "verifyUser"   
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("from middleware")
        return res.sendStatus(401)
    }

    const token = authHeader.split(' ')[1];
    try {
        const verifyUser = jwt.verify(token, jwtSecret)
        if (verifyUser) {
            console.log('crossed middleware ')
            return next()
        }
        return res.sendStatus(403)                 // sends Forbidden

    } catch (error) {
        console.error("jwt verification error")
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token expired"
            })
        }
        return res.sendStatus(401)
    }
}
 // written even the logic for token expiry


module.exports = userMiddleware;