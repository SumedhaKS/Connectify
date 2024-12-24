import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import './RoomPage.css'; // Import the custom CSS

const RoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [newRoomSize, setNewRoomSize] = useState(2);
    const [joinRoom, setjoinRoom] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in first!");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch("http://localhost:3001/joined-rooms", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    alert("Error fetching rooms!");
                    return;
                }

                const data = await response.json();
                setRooms(data.rooms);
            } catch (error) {
                console.error("Error fetching rooms:", error);
                alert("Failed to fetch rooms, please try again.");
            }
        };

        fetchRooms();
    }, []);

    const enterRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    const createRoom = async () => {
        if (!newRoomName) {
            alert("Please enter a room name!");
            return;
        }

        if (newRoomSize < 2) {
            alert("Room size must be at least 2.");
            return;
        }

        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:3001/create-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newRoomName, size: newRoomSize }),
            });

            if (!response.ok) {
                alert("Error creating room!");
                return;
            }

            const responseText = await response.text();
            const newRoomId = responseText.split(" ")[4];
            setRooms((prevRooms) => [...prevRooms, { name: newRoomName, _id: newRoomId }]);
            setNewRoomName("");
            setNewRoomSize(2);
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room, please try again.");
        }
    };

    return (
        <div className="room-container">
            <h2 className="app-title">Welcome to Connectify!</h2>

            {/* Display list of rooms */}
            <div className="rooms-list">
                <h3>Your Rooms</h3>
                {rooms.length === 0 ? (
                    <p>You have not joined any rooms yet.</p>
                ) : (
                    <ul>
                        {rooms.map((room) => (
                            <li key={room._id} className="room-item">
                                <div><strong>{room.name}</strong></div>
                               <div> <button onClick={() => enterRoom(room._id)} className="join-button">Join</button> </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Create Room */}
            <div className="create-room">
                <h3>Create a New Room</h3>
                <input
                    type="text"
                    placeholder="Enter Room Name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="number"
                    min="2"
                    placeholder="Enter Room Size"
                    value={newRoomSize}
                    onChange={(e) => setNewRoomSize(e.target.value)}
                    className="input-field"
                />
                <button onClick={createRoom} className="create-button">Create Room</button>
            </div>

            {/* Join Room */}
            <div className="join-room">
                <h3>Join Room</h3>
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={joinRoom}
                    onChange={(e) => setjoinRoom(e.target.value)}
                    className="input-field"
                />
                <button onClick={() => enterRoom(joinRoom)} className="join-button">Join</button>
            </div>
        </div>
    );
};

export default RoomPage;