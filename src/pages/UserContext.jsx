//import hooks
import React, { createContext, useState, useContext } from 'react';

//create user context
const UserContext = createContext();

//Define a provider component
export function UserProvider({ children }) {
  
  //Store new users in to an array
  const [users, setUsers] = useState([]);  
  const addUser = (userData) => {
    setUsers((prevUsers) => [...prevUsers, userData]);
  };  

  //return context with users and addUser
  return (
    <UserContext.Provider value={{ users, addUser }}>
      {children}
    </UserContext.Provider>
  );
}

//Create a custom hook as addUser
//using this we can access UserContext in components
export function useUser() {
  return useContext(UserContext);
}