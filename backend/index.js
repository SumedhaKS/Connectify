const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const app = express()
const port = 3000
const { UserZodSchema } = require("./config")
const { User } = require("./db/index")

app.use(express.json())
app.use(bodyParser.json())

app.get('/', (req, res) => {      //dummmy end point
    res.json({
        msg: "Hello"
    })
})

app.post('/signup', async (req, res) => {  //for now let us just ask user for his username, email and password 
    const { username, email, password } = req.body;
    const validationResponse = UserZodSchema.safeParse({                      //validating inputs
        name: username,
        email,                                                              // for email after gmail. -> anything is accepted.It's a bug
        password,
    });

    if (!validationResponse.success) {
        return res.status(400).json({                               //if not valid
            msg: "Invalid inputs",
        })
    }
    try {
        // const existingUser = await User.findOne({name: username})
        // const existingEmail = await User.findOne({email:email})
        const existingUser = await User.findOne({                   //equivalent to running above 2 queries. Infact better 
            $or: [{ name: username }, { email }]
        })

        if (existingUser) {
            return res.json({
                message: "User or email already exists. Please Login."
            })
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)   //hashing user password for storing. 10 means 2^10 times the password gets hashed
            await User.create({
                name: username,
                email,
                password: hashedPassword
            })
            res.status(200).json({
                message: "User created successfully"
            })
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Somethings wrong. Please try again later."
        })
    }
})                                      // "/signup" is tested. Bug is commented above.(email validation) 

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // validate if user has provided all fields or not.
    if (!username || !email || !password) {
        return res.json({
            message: "Fill all inputs"
        })
    }
    else {
        const response = await User.findOne({       //find the user
            name: username,
            email
        })
        if (!response) {
            res.status(404).json({
                msg: "User not found"
            })
        }
        else {                                  //validate password
            const isMatch = await bcrypt.compare(password, response.password)
            if (!isMatch) {
                res.status(400).send("Wrong password")
            }
            else {
                res.status(200).json({
                    message: "Login successfull"
                })
            }
        }
    }
})                                           // "/login" tested ok. JWT is not used. This is just a basic version.



app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
})

