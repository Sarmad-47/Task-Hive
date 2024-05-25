import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setSuccessMessage('Account created successfully!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already in use. Please use a different email.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 8 characters long.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            {showSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center justify-between">
                <span>{successMessage}</span>
                <button onClick={() => setShowSuccess(false)} className="text-green-700">
                  <FiX size={20} />
                </button>
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center justify-between">
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage('')} className="text-red-700">
                  <FiX size={20} />
                </button>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-semibold text-gray-700">Please Create An Account</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7" onSubmit={signUp}>
                <div className="relative">
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-black" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="relative">
                  <div className="flex items-center">
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-black"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <button type="button" onClick={togglePasswordVisibility} className="text-gray-600 focus:outline-none">
                      {showPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>
                <div>
                  <p className='text-base'>If you have an account, please <Link to='/login' className='underline text-blue-600'>Login Now</Link> here</p>
                </div>
                <div className="relative">
                  <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white rounded px-6 py-1">Sign up</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
