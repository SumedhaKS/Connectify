import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket";
  
const RoomChat = () => {
    const { roomId } = useParams(); // Get roomId from the URL
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Join the room on component mount
        socket.emit("join-room", roomId);

        // Listen for incoming messages
        socket.on("receive-message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup on unmount
        return () => {
            socket.emit("leave-room", roomId);
            socket.off("receive-message");
        };
    }, [roomId]);

    const sendMessage = () => {
        if (!newMessage) return;

        const message = { roomId, text: newMessage, timestamp: new Date() };
        socket.emit("send-message", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage(""); // Clear input
    };

    return (
        <div>
            <h2>Room Chat</h2>
            <div>
                <h3>Room ID: {roomId}</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.timestamp}:</strong> {msg.text}
                        </li>
                    ))}
                </ul>
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default RoomChat;
