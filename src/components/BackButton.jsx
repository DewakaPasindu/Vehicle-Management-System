import React from 'react'
import { useNavigate } from 'react-router-dom'
import './backButton.css'

export default function BackButton() {
    const Navigate = useNavigate();
  return (
    <div>
      <button className='theBackButton' onClick={() => Navigate(-1)}>BACK</button>
    </div>
  )
}
