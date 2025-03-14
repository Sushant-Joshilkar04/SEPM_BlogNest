import React from 'react'

const Dashboard = () => {
  const token = localStorage.getItem("token");

  console.log(token);
  
  return (
    <div>
      DashBoard
    </div>
  )
}

export default Dashboard
