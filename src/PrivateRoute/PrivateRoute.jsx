import React,{useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  /**
   * Note this useEffect is for debugging only.
   * It has no further use. 
   */
  useEffect(() => {
    console.log('User:', user);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [user, loading, error]);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
