//import react, hooks, and components
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Import route pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import VehiclesDetails from './pages/VehiclesDetails';

import { UserProvider } from './pages/UserContext';
import EditUser from './pages/EditUser';

function App() {
  return (
    <div>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/Dashboard' element={<Dashboard/>}></Route>
            <Route path='/Login' element={<Login/>}></Route>
            <Route path='/Register' element={<Register/>}></Route>
            <Route path='/Admin' element={<Admin/>}></Route>
            <Route path='/Vehicles' element={<VehiclesDetails/>}></Route>
            <Route path="/edit-user/:username" element={<EditUser/>} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
