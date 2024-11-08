import { useState } from "react";
import { useNavigate } from "react-router-dom";

//import { Link } from 'react-router-dom';

const HomePage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleSignInClick = () => {
    setIsAnimating(true);

    navigate("/sign-in");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center transition-transform duration-300 ${
        isAnimating ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-vector/blue-medical-background-with-text-space_1017-19374.jpg?t=st=1727960764~exp=1727964364~hmac=8efc85fc164494607ed89742fb0dc2956fec723959ab1add8c8313505ad68268&w=996")',
      }}
    >
      <h2 className="text-4xl font-bold text-white mb-6 animate-pop-up">
        Welcome to the System
      </h2>
      <div className="flex space-x-10 mt-6">
        <button
          onClick={handleSignInClick}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
