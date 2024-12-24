import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';  // Add this import

const Home = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
  <div className="container1">  
    <div style={{ textAlign: 'center',  height: '100vh', fontFamily: 'Playfair Display', }}>

      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center">
        {/* Add the title here */}
      <h2 className="text-4xl font-bold text-gray-900 mb-6 playfair-font"></h2>

        <div style={{ textAlign: 'center',  fontFamily: 'Playfair Display' }}>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 playfair-font">
           
            <span className="text-indigo-600 inline-block ml-2"></span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-12">
          </p>

          <div className="contaminator">
          <div className="button-container mb-12">
            <div 
              data-text="SignUp" 
              style={{ '--r': '-15' }} 
              className="glass cursor-pointer"
              onClick={handleSignup}
            >
              <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-10 1.67-10 5v2h20v-2c0-3.33-6.69-5-10-5z"/>
              </svg>
            </div>
            <div 
              data-text="LogIn" 
              style={{ '--r': '5' }} 
              className="glass cursor-pointer"
              onClick={handleLogin}
            >
              <svg viewBox="0 0 24 24" height="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 13h-4v-2h4V7l5 5-5 5v-4zm-4 4H4v-2h8v2z"/>
              </svg>
            </div>
          </div>
          </div>
        </div>

        <div style={{ textAlign: 'end', fontFamily: 'Playfair Display' }}>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 text-3xl mb-4"></div>
            <h3 className="text-xl font-semibold mb-2"> </h3>
            <p className="text-gray-600">
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 text-3xl mb-4"></div>
            <h3 className="text-xl font-semibold mb-2"></h3>
            <p className="text-gray-600">
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-indigo-600 text-3xl mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">
              </h3>       <p className="text-gray-600">
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Home;