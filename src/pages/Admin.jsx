//import react, hooks, and components
import React, { useEffect, useState } from 'react';
import './admin.css';
import NameAnimation from '../components/NameAnimation';
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom';

//Main function
export default function Admin() {

  //States to hold users, filteredusers, loading, error, and searchterm
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  //navigate function
  const navigate = useNavigate();

  //Get the logged-in username from localStorage
  const loggedInUsername = localStorage.getItem('username');

  const handleHomeClick = () => {
    if (window.confirm("When you click HOME you will automatically log out. Do you want to LOGOUT?")) {
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/register');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (username) => {
    navigate(`/edit-user/${username}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id='container-admin'>
      <div className='mainmenu'>
        <button className='navigateButton' onClick={handleHomeClick}>HOME</button>
      </div>
      <div id="Company-logo-admin">
        <img className='logo' src="cLogo.png" alt="logo"/>
      </div>
      <div id='search-bar-admin'>
        <input
          type='text'
          placeholder='Search by Username...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='search-bar-admin'
        />
      </div>
      <h1 id='name'>Registration Data</h1>
      <table className='table-admin'>
        <thead>
          <tr>
            <th>Name</th>
            <th>NIC</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.username}>
                <td>{user.name}</td>
                <td>{user.nic}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.username === loggedInUsername && (
                    <button id='edit-button-admin' onClick={() => handleEditClick(user.username)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" >No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div id="nameAnimation">
        <NameAnimation/>
      </div>
      <div id="backButton">
        <BackButton/>
      </div>
    </div>
  );
}
