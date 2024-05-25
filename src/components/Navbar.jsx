import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <div className='bg-[#1d2125] w-full h-12 p-3 border-b bordered-box flex flex-row justify-between border-b-[#9fadbc29]'>
      <div className="left justify-center items-center flex">
        <h3 className='text-slate-50'>Trello Clone By Sarmad Ahmad</h3>
      </div>
      <div className="right flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm'
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
