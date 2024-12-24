import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket";
import './RoomChat.css'; // Import the custom CSS

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
        <div className="chat-container">
            <div className="chat-box">
                <h2 className="room-title">Room Chat</h2>
                <h3 className="room-id">Room ID: {roomId}</h3>
                <div className="messages-list">
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index} className="message-item">
                                <span className="message-timestamp">
                                    {new Date(msg.timestamp).toLocaleString()}:
                                </span>
                                <span className="message-text">{msg.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="message-input"
                    />
                    <button onClick={sendMessage} className="send-button">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomChat;
