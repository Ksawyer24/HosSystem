import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInForm = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => { 
        e.preventDefault();
    
        axios.post('https://localhost:7265/api/auth/login', {
            username: userName,
            password: password,
        })
        .then((response) => {
            console.log('Login successful!');
            localStorage.setItem('authToken', response.data);
            setIsLoginSuccessful(true);
            setErrorMessage('');

            // Display welcome message then navigate to dashboard
            setTimeout(() => {
                navigate("/dash-home");
            }, 2000); // 2000 ms = 2 seconds
        })
        .catch((error) => {
            if (error.response) {
                setErrorMessage(error.response.data.message || 'Login failed, incorrect username or password');
            } else {
                setErrorMessage('Network error, please try again later');
            }
            setIsLoginSuccessful(false);
            console.error('Login error:', error);
        });
    };
    
    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 p-4'>
            <h2 className='absolute top-2 left-2 font-bold text-3xl text-white'>HosSys</h2>
            <h2 className='font-bold text-2xl mb-4 text-white'>Sign In</h2>
            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-2 mb-2">
                    <div className="w-full px-4">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-8 leading-tight focus:outline-none focus:bg-white"
                            id="username"
                            type="text"
                            placeholder="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap -mx-2 mb-4">
                    <div className="w-full px-4">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-8 leading-tight focus:outline-none focus:bg-white"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="text-red-500 mb-3 text-center text-sm">{errorMessage}</div>
                )}

                {isLoginSuccessful && (
                    <div className="w-full max-w-sm px-3 py-2 mb-4 text-green-700 bg-green-100 border border-green-400 rounded text-center text-sm">
                        <p className="font-bold">Login Successful!</p>
                        <p>Welcome, {userName}!</p>
                    </div>
                )}

                <div className="flex flex-wrap -mx-2 mb-4">
                    <div className="w-full px-3 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-16 rounded text-sm"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignInForm;
