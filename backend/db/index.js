const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://admin:admin%400204@cluster0.cmmy0.mongodb.net/test-roomify") // put url

/*
 - User db for storinig user info like name,password, email, joined rooms/saved rooms, (when user creates a room add it's _id to the joined rooms itself). 
        --> " {Additionally can add friends list.} "

 - Rooms db for storing particular rooms _id, messages. 
   -->(how about making the converstions last for 2 days?)

*/

const UserSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    joinedRoomsId: [{                         // Look over joined_rooms_id schema_type again....
        type: mongoose.Schema.ObjectId,
        ref: 'RoomSchema'
    }]                                          
});

const RoomSchema = new mongoose.Schema({
    messages: String
});


const User = mongoose.model('User', UserSchema)
const Room = mongoose.model('Room', RoomSchema)

module.exports = {
    User,
    Room
}