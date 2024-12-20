// packages used =>
//                  express, body-parser, jsonwebtoken, cors, socket.io, bcrypt, 

const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
const port = 3001
const { UserZodSchema, jwtSecret } = require("./config")
const { User, Room, Messages } = require("./db/index")
const userMiddleware = require("./middleware/User")

//  socket.io connections
const http = require("http")
const { Server } = require("socket.io")
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",       // my React url
        methods: ["GET", "POST"],
    },
})

// ##########################################################
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

// Socket.io events
io.on("connection", (socket) => {
    console.log("User connected: ", socket.id)

    //  join specific room
    socket.on("join-room", async (userId, roomId) => {
        const findUser = await User.findOne({ name: userId })
        if(!findUser){
            return socket.emit("error", { message: "User not found" });
        }
        userId = findUser._id;                                                   //finding the ID of the user

        console.log(`User ${userId} is joining room ${roomId}`)

        const room = await Room.findById(roomId);

        if (!room) {
            return socket.emit("error", { message: "Room not found" });
        }

        // if user not in members array the adding them here
        if (!room.members.includes(userId)) {
            room.members.push(userId);
            await Room.save()                               // it's either room or Room
        }

        socket.join(roomId);                            // adding user to socket.io room
        io.to(roomId).emit("user-joined", { userId, roomId });
    })

      // Send message to room
    socket.on("send-message", async (userID, roomID, message) => {
        console.log(`Message from User:${userID} in room: ${roomID} : ${message}`);

        // Save the message in the database
        const newMessage = await Messages.create({
            roomID,
            senderID: userID,
            messages: message,
        });


        // Broadcast the message to other users in the room
        io.to(roomID).emit("receive-message", {
            senderID: userID,
            content: message,
            createdAt: newMessage.createdAt,
        });
    });

   
    //  handling if user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    })
})

// ##########################################################
app.get('/', (req, res) => {      //dummmy end point
    res.json({
        msg: "Hi hello hru"
    })
})
// ##########################################################

app.post('/signup', async (req, res) => {  //for now let us just ask user for his username, email and password 
    const { username, email, password } = req.body;
    const validationResponse = UserZodSchema.safeParse({                      //validating inputs
        name: username,
        email,                                               // * for email after gmail. -> anything is accepted.It's a bug
        password,
    });
    console.log(validationResponse)
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

// #####################################################

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // validate if user has provided all fields or not.
    try {
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
                return res.status(404).json({
                    msg: "User not found"
                })
            }
            else {                                  //validate password
                const isMatch = await bcrypt.compare(password, response.password)
                if (!isMatch) {
                    return res.status(400).send("Wrong password")
                }
                else {
                    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '24h' })
                    return res.status(200).json({
                        token,
                        message: "Login successful"
                    })
                }
            }
        }
    } catch (e) {
        console.error("Login Error");
        return res.status(500).json({
            message: "Error occurred during login. Please try again later."
        })
    }
})                                           // 'login' done. tested once. not tested token expiry.

// ######################################################

app.get('/joined-rooms', async (req, res) => {                              // to fetch the rooms the user has already joined
    const userId = req.headers.authorization.split(' ')[1]
    const decodedUserId = jwt.decode(userId)
    try {

        const userData = await User.findOne({ name: decodedUserId.username })
        const response = await Room.find({ members: userData._id })
        res.json({
            userId : userData._id,
            username : userData.name,
            rooms : response,
        })
    }
    catch (error) {
        res.json({ error: "error fetching rooms" })
    }
})

// #######################################################

app.post('/create-room', userMiddleware, async (req, res) => {
    // body: name, size, age_restriction(optional)

    const roomName = req.body.name;
    const roomSize = parseInt(req.body.size);
    const userBody = req.headers.authorization.split(' ')[1];
    const decodedUser = jwt.decode(userBody);
    console.log(roomName, '\n', typeof (roomSize), roomSize, '\n', userBody, '\n', decodedUser, '\n')

    try {                                                      // I think we can check if the name is already existing or not.
        if (roomSize < 2) {
            return res.json({
                message: "Room size to be atleast 2."
            })
        }
        const creatorBody = await User.findOne({ name: decodedUser.username })
        const creatorId = creatorBody._id
        console.log(creatorId)
        const newRoom = await Room.create({
            name: roomName,
            creatorId: creatorId,                      // CreatorID should be the _id of the creator
            members: [creatorId],
            size: parseInt(roomSize),
        })
        return res.status(201).send(`Room created. RoomID is ${newRoom._id}`)

    } catch (error) {
        console.error(error)
        return res.send("Error while creating room. Please try again later.")
    }

})

app.post('/join-room', userMiddleware, async (req, res) => {
    const roomId = req.body.joining_id;
    const username = req.headers.authorization.split(' ')[1];
    const decodedUserName = jwt.decode(username);
    const response = await Room.findOne({ _id: roomId });

    if (!response) {
        return res.status(401).json({
            message: "Room not found"
        })
    }
    else {
        console.log(response);
        const findUser = await User.findOne({ name: decodedUserName.username })
        if(response.members.includes(findUser._id)){
            return res.json({
                message: "User is already in this room"
            })
        }
        response.members.push(findUser._id)
        await response.save()

        res.json({
            message : "Room joined successfully",
            roomID : response._id,
            roomName : response.name
        })

        io.to(response._id).emit("user-joined", {userId : findUser._id , roomId : response._id })       // letting others now that the user has joined
    }

})


// ######################################################
server.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`)
})

