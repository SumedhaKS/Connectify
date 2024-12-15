// Main file where we import all other components

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoomPage from "./components/RoomPage";
import RoomChat from "./components/RoomChat"; // Import the RoomChat component
  
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/roompage" element={<RoomPage />} />
                <Route path="/room/:roomId" element={<RoomChat />} /> 
            </Routes>
        </Router>
    );
}

export default App;
