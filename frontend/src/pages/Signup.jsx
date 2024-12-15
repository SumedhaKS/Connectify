import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ()=> {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password1, setPassword1] = useState('')
    const  navigate = useNavigate()

    const handleSignUp = async (e)=>{
        e.preventDefault()

        if(password !== password1){
            alert("Passwords are not matching. Please try again")
            return
        }

        try{
            console.log(username, email, password)
            const dataBody = {
                username,
                email,
                password,
            }
            const response = await fetch("http://localhost:3001/signup", {
                method : "POST",
                headers : {
                    "Content-type" : "application/json", 
                },
                body : JSON.stringify(dataBody),
            })
            if(response.ok){
                alert("SignUp done")
                navigate("/login")
            }
            else{
                alert("Wrong inputs. Try again" )
            }
        }
        catch(error){
            console.error("An error occurred")
            alert("Error occurred. Please try again later.")
        }
    }

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignUp}>
                <div>
                    <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    <input type="password" placeholder="Re-enter Password" value={password1} onChange={(e)=>setPassword1(e.target.value)} />
                    <button type="submit">SignUp</button>
                </div>
            </form>
        </div>
    )
}

export default Signup;