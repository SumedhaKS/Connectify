import React from "react"
import RoomPage from "../components/RoomPage"
import { useNavigate } from "react-router-dom"

const Home = ()=>{
    const  navigate = useNavigate()

    const handleSignup = ()=>{
        navigate("/signup")
    }
    const handleLogin = ()=>{
        navigate("/login")
    }

    
    return (
        <div>
            <h1>Welcome to Connectify</h1>
            <button onClick={handleSignup}>SignUp</button>
            <button onClick={handleLogin}>Login</button>
        </div>
        
    )
}

export default Home;