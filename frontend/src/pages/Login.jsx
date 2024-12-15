import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ()=>{
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    
    const handleLogin = async ()=>{
        
        const userData =  {username, email, password}
        try{
            const response = await fetch("http://localhost:3001/login", {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(userData),
            })
            const data = await response.json()
            if(response.ok){
                localStorage.setItem('token', data.token)
                console.log("login successful: ", data)
                navigate("/roompage")

            }
            else{
                console.error("Login failed: ", data.message)
                alert(data.message)
            }
        }
        catch(error){
            console.error("Error logging in: ", error)
            alert("An error occurred. Please try again later")
        }
    }


    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)}/>
            <input type="email" placeholder="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    ) 
}

export default Login;