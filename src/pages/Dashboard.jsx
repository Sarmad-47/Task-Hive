import React from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Main from '../components/Main';
const Dashboard = () => {
    return (
        <>
            <Navbar />
            <div className='content flex'>
                <Sidebar />
                <Main />
            </div>
        </>
    )
}

export default Dashboard;