//import react, hooks, and components
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './register.css';
import NameAnimation from '../components/NameAnimation'; 
import BackButton from '../components/BackButton';

//main function 
export default function Register() {

  //Use empty values to store data in the registration form as an arrey.
  //formData is the initial value of the form.
  //to update the form we use setFormData.
  // by calling useState we call initiakl values for the state.
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  //state to control password (shown or hidden)
  const [showPassword, setShowPassword] = useState(false);

  //state to loaging process checking
  const [loading, setLoading] = useState(false);

  //navigate to routs
  const navigate = useNavigate();

  //access addUser which is in the UserCintext.jsx file
  const { addUser } = useUser();

  //update the form state.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      //e.target.name is the inpute value of the input field and e.target.value is the value that user input
      [e.target.name]: e.target.value
    });
  };

  //Trigger form submition
  const handleSubmit = async (e) => {
    //make the form srtucture as default
    e.preventDefault();

    //Basic form validation
    if (!formData.name || !formData.nic || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    //By creating veriable we assign the validation method and then wee test if the user input is ok or not.
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      alert('Name can only contain letters and spaces');
      return;
    }

    const nicRegex = /^[0-9]{9}[Vv]|[0-9]{12}$/;
    if (!nicRegex.test(formData.nic)) {
      alert('Please enter a valid NIC number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (formData.username.length < 4 || /\s/.test(formData.username)) {
      alert('Username must be at least 4 characters long and contain no spaces');
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('Password must be at least 8 characters long and include a number and a special character');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    //if all details are matching with the validation method we send data to the server.
    setLoading(true);

    try {
      //We are tying to post data in to the database and check for errors
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          nic: formData.nic,
          email: formData.email,
          username: formData.username,
          password: formData.password
        })
      });

      //We are waiting to the form data to send the database
      const result = await response.json();

      if (response.ok) {
        addUser(formData);
        alert('Registration successful');
        navigate('/login');
      } else {
        alert("Registration failed: " + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div id='container-register'>
      <div className='mainmenu'>
        <button className='navigateButton' onClick={() => navigate('/')}>HOME</button>
      </div>
      <div id="Company-logo">
        <img className='logo' src="cLogo.png" alt="logo"/>
      </div>
      <div id='form-wrapper-register'>
        <form onSubmit={handleSubmit}>
          <h1 id='FormName-register'>REGISTER</h1>
          <div>
            <label htmlFor='name'> <strong>NAME</strong> </label>
            <input 
              type='text' 
              placeholder='Enter Name' 
              name='name' 
              id='name-input' 
              value={formData.name} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='nic'> <strong>NIC</strong> </label>
            <input 
              type='text' 
              placeholder='Enter NIC' 
              name='nic' 
              id='nic-input' 
              value={formData.nic} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='email'> <strong>EMAIL</strong> </label>
            <input 
              type='email' 
              placeholder='Enter Email' 
              name='email' 
              id='email-input' 
              value={formData.email} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='username'> <strong>USERNAME</strong> </label>
            <input 
              type='text' 
              placeholder='Enter Username' 
              name='username' 
              id='username-input' 
              value={formData.username} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='password'> <strong>PASSWORD</strong> </label>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter password' 
              name='password' 
              id='password-input' 
              value={formData.password} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='confirmPassword'> <strong>CONFIRM PASSWORD</strong> </label>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder='Confirm password' 
              name='confirmPassword' 
              id='confirm-password-input' 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required
            />
          </div>
          <div>
            <label htmlFor='showPassword'>
              <input 
                type="checkbox" 
                id="showPassword" 
                onChange={() => setShowPassword(!showPassword)} 
              />
              Show Password
            </label>
          </div>
          <div>
            <button type="submit" id='register-button' disabled={loading}>REGISTER</button>
          </div>
          <div>
            <p id='or-reg'>- OR IF YOU ALREADY REGISTERED -</p>
          </div>
          <div id="loginLink">
            <button id='register-button' type="button" onClick={() => navigate('/login')}>LOGIN</button>
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
