//import react, hooks, and components
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './editUser.css';
import NameAnimation from '../components/NameAnimation';
import BackButton from '../components/BackButton';

//Main function
export default function EditUser() {
  //Export the username from the web page
  const { username } = useParams();

  //State to hold the user data fetched from the server
  const [user, setUser] = useState(null);

  //State to hold the form data for editing the user details
  const [formData, setFormData] = useState({});

  //Navigate
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (window.confirm("When you click HOME you will automatically log out. Do you want to LOGOUT?")) {
      navigate("/");
    }
  };

  //Function to fetch data when the user is changed
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/register/${username}`);
        const data = await response.json();
        setUser(data);
        setFormData({ username: data.username, email: data.email, password: data.password });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    //call fetch user function
    fetchUser();
  }, [username]); //Array to trigger useEffect

  //For handlke input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value //Update the specific field that changed
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/register/${username}`, {
        //Use the PUT method to update existing data
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        //Convert form data to a JSON string for sending
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('User updated successfully');
        navigate('/admin');
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  //If the user data has not yet loaded, display a loading message
  if (!user) return <p>Loading...</p>;

  return (
    <div id="edit-user-container">
      <div className='mainmenu'>
        <button className='navigateButton' onClick={handleHomeClick}>HOME</button>
      </div>
      <div>
        <div id="Company-logo-edit">
          <img className='logo' src="/cLogo.png" alt="Company logo"/>
        </div>
      </div>
      <h1 id="edit-user-heading">Edit User</h1>
      <form id="edit-user-form" onSubmit={handleSubmit}>
        <div id="form-group">
          <label htmlFor='name' id='name-label'>Name:</label>
          <input
            type='text'
            id='name-input'
            name='name'
            value={user.name}
            disabled
          />
        </div>
        <div id="form-group">
          <label htmlFor='nic' id='nic-label'>NIC:</label>
          <input
            type='text'
            id='nic-input'
            name='nic'
            value={user.nic}
            disabled
          />
        </div>
        <div id="form-group">
          <label htmlFor='email' id='email-label'>Email:</label>
          <input
            type='email'
            id='email-input'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div id="form-group">
          <label htmlFor='username' id='username-label'>Username:</label>
          <input
            type='text'
            id='username-input-edit'
            name='username'
            value={formData.username}
            onChange={handleChange}
            disabled
          />
        </div>
        <div id="form-group">
          <label htmlFor='password' id='password-label'>Password:</label>
          <input
            type='password'
            id='password-input-edit'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div id="form-group">
          <button id='submit-button' type='submit'>SAVE CHANGES</button>
        </div>
      </form>
      <div id="nameAnimation">
        <NameAnimation/>
      </div>
      <div id="backButton">
        <BackButton/>
      </div>
    </div>
  );
}
