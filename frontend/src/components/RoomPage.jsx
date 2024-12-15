import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
   
const RoomPage = () => {
    const [rooms, setRooms] = useState([]); // List of rooms the user has joined
    const [newRoomName, setNewRoomName] = useState(""); // New room name
    const [newRoomSize, setNewRoomSize] = useState(2); // New room size
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in first!");
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
                setRooms(data.rooms); // Assuming backend sends rooms array in `rooms`
            } catch (error) {
                console.error("Error fetching rooms:", error);
                alert("Failed to fetch rooms, please try again.");
            }
        };

        fetchRooms();
    }, []);

    // Navigate to room chat page
    const enterRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    // Function to create a new room
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
            console.log("Successfully created room:", responseText);

            const newRoomId = responseText.split(" ")[4]; // Extract room ID from response
            setRooms((prevRooms) => [...prevRooms, { name: newRoomName, _id: newRoomId }]);
            setNewRoomName(""); // Clear input
            setNewRoomSize(2); // Reset size input
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Failed to create room, please try again.");
        }
    };

    return (
        <div>
            <h2>Welcome to Connectify!</h2>

            {/* Display list of rooms */}
            <div>
                <h3>Your Rooms</h3>
                {rooms.length === 0 ? (
                    <p>You have not joined any rooms yet.</p>
                ) : (
                    <ul>
                        {rooms.map((room) => (
                            <li key={room._id}>
                                <strong>{room.name}</strong>{" "}
                                <button onClick={() => enterRoom(room._id)}>Join</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Create Room */}
            <div>
                <h3>Create a New Room</h3>
                <input
                    type="text"
                    placeholder="Enter Room Name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                />
                <input
                    type="number"
                    min="2"
                    placeholder="Enter Room Size"
                    value={newRoomSize}
                    onChange={(e) => setNewRoomSize(e.target.value)}
                />
                <button onClick={createRoom}>Create Room</button>
            </div>
        </div>
    );
};

export default RoomPage;
