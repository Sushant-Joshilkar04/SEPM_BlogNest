import React from 'react'
import Sidebar from '../components/Sidebar';
// import CreateBlog from '../components/CreateBlog';
const Dashboard = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:ml-64 transition-all duration-300">

     
      </main>
      
    </div>
  )
}

export default Dashboard
