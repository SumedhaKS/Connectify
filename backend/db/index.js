const mongoose = require("mongoose")


mongoose.connect("") // put url
 
=======
mongoose.connect("mongodb-url-here") // put url


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
    name : {type: String, required : true},
    creatorId : {type: mongoose.Schema.ObjectId, ref:'UserSchema', required : true  },
    members : [{type: mongoose.Schema.ObjectId, ref:'UserSchema' }],
    size : {type: Number, required : true },
    createdAt : {type: Date, default : Date.now}
}); 

const MessagesSchema = new mongoose.Schema({
    roomId : {type : mongoose.Schema.ObjectId, ref: 'RoomSchema' , required : true},
    senderId : {type : mongoose.Schema.ObjectId, ref:'UserSchema', required:true},
    messages :  String,
    timeStamp : {type : Date, default:Date.now }
})
// can add content type to specify File or message . and if file then can have a field as file url.

const User = mongoose.model('User', UserSchema)
const Room = mongoose.model('Room', RoomSchema)
const Messages = mongoose.model('Messages', MessagesSchema)


module.exports = {
    User,
    Room,
    Messages
}
