//import react, hooks, and components
import React from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom'

//Main function
export default function Home() {

  //Navigatin
  const Navigate = useNavigate();

  //Use to type every HTML components
  return (
    <div>
      <div className="Company-logo"> 
          <img className='logo' src="cLogo.png" alt="logo"/>
      </div>
      
      <div className='mainmenu'>
        <button className='homepageButton' onClick={() => Navigate("/Login")}>LOGIN</button>
        <button className='homepageButton' onClick={() => Navigate("/Register")}>REGISTER</button>
      </div>
      
      <div className='title'>
        <h1>ENTRANCE VEHICLE MANAGEMENT SYSTEM</h1>
      </div>
    </div>
  )
}