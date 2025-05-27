//import react, hooks, and components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import NameAnimation from '../components/NameAnimation';
import BackButton from '../components/BackButton';
import axios from 'axios';

//Main function
export default function LoginForm() {
  //State for managing login data
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  //State for managing error messages
  const [error, setError] = useState(null);

  //Navigate
  const navigate = useNavigate();

  //Handler for input change events
  const handleChange = (e) => {
    setLoginData({
      //Copy existing state
      ...loginData,
      //Update the specific field
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    //Send a POST request to the login endpoint with username and password
    axios.post('http://localhost:3001/login', { 
      username: loginData.username, 
      password: loginData.password
    })
    .then(response => {
        if (response.data.status === 'success') {
            console.log('Login successful:', response.data);

            const { username } = response.data;
            if (username) {
              localStorage.setItem('username', username); 
              navigate('/dashboard'); 
            } else {
              setError('Username not found in response.'); navigate('/'); 

            }
        } else {
            setError(response.data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        setError('An error occurred. Please try again.');
    });
  };

  return (
    <div id='signup-container'>
        <div className='mainmenu'>
            <button className='navigateButton' onClick={() => navigate('/')}>HOME</button>
        </div>
        <div id="Company-logo-login">
            <img className='logo' src="cLogo.png" alt="logo"/>
        </div>
      <div id='signup-form-wrapper'>
        <form id='form' onSubmit={handleLogin}>
          <h1 id='FormName'>LOGIN</h1>
          {error && <div className="alert">{error}</div>}
          <div>
            <label htmlFor='username'> <strong>USER NAME</strong> </label>
            <input 
              type='text' 
              placeholder='Enter Username' 
              name='username' 
              id='username-input' 
              value={loginData.username} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='password'> <strong>PASSWORD</strong> </label>
            <input 
              type='password' 
              placeholder='Enter password' 
              name='password' 
              id='password-input' 
              value={loginData.password} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <button type="submit" id='login-button'>LOG IN</button>
          </div>
          <div>
            <p id='or-log'>- OR IF YOU NEED TO REGISTER -</p>
          </div>
          <div id="registerLink">
            <button id='register-button' type="button" onClick={() => navigate('/register')}>REGISTER</button>
          </div>
        </form>
      </div>
      <div id="nameAnimation">
        <NameAnimation/>
      </div>
      <div id="backButton">
        <BackButton/>
      </div>
    </div>
  );
}
