// This is for user validation / authentication after signup.       (Actually this is login logic)
const bcrypt = require("bcrypt")
const { User } = require('../db')

async function userMiddleware(req, res, next) {          //using req.body for small testing. need to be changed to headers. Later use jwt for this
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // validate if user has provided all fields or not , then store in db
    if (!username || !email || !password) {
        return res.json({
            message: "Fill all inputs"
        })
    }
    else {
        const response = await User.findOne({
            name: username,
            email
        })
        if (!response) {
            res.status(404).json({
                msg: "User not found"
            })
        }
        else {
            const isMatch = await bcrypt.compare(password, response.password)
            if (!isMatch) {
                res.send("Wrong password")
            }
            else {
                next()
            }
        }
    }

}

//logic of login. This is not required now. Need to be written again for proper endpoints

module.exports = userMiddleware;