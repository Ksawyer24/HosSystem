import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('https://localhost:7265/api/auth/register', {
            firstName,
            lastName,
            email,
            username: userName,
            phoneNumber,
            password,
            roles
        })

        .then(() => {
            console.log('Sign up successful!');
            setIsSignUpSuccessful(true);
            setErrorMessage('');
           navigate("/login")
        })

        .catch((error) => {
            if (error.response) {
                setErrorMessage(error.response.data.message || 'Sign up failed');
            } else {
                setErrorMessage('Network error, please try again later');
            }
            setIsSignUpSuccessful(false);
            console.error('Sign up error:', error);
        });
    };

    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 p-4'>
            <h2 className='absolute top-4 left-4 font-bold text-2xl text-white'>HosSys</h2>
            <h2 className='font-bold text-2xl mb-4 text-white'>Sign Up</h2>
            <form className="w-full max-w-md" onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Last Name */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Username */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="username"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="phoneNumber">
                            Phone Number
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="phoneNumber"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Roles */}
                <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-6">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="roles">
                            Role
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="roles"
                            type="text"
                            value={roles}
                            onChange={(e) => setRoles(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="text-red-500 mb-3 text-center">{errorMessage}</div>
                )}

                {/* Success Message */}
                {isSignUpSuccessful && (
                    <div className="w-full max-w-md px-4 py-3 mb-5 text-green-700 bg-green-100 border border-green-400 rounded-lg text-center">
                        <p className="font-bold">Sign Up Successful!</p>
                        <p>Welcome, {firstName}!</p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3 flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-20 rounded"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                <div className="flex justify-end ">
                    <Link to="/sign-in" className="text-white underline text-x">
                       Sign in if you already have an account
                    </Link>
                </div>

              
            </form>
        </div>
    );
};

export default SignUpForm;
