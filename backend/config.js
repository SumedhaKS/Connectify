//This is for zod validation logic

const jwt = require("jsonwebtoken")
const zod = require("zod")
const jwtSecret = 'ushhh'

const UserZodSchema = zod.object({
    name : zod.string().min(6),
    email : zod.string().email(),
    password : zod.string().min(8),
      
})



module.exports = {UserZodSchema, jwtSecret, jwt};