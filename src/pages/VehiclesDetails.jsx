//import react, hooks, and components
import React, { useEffect, useState } from 'react';
import './vehiclesDetails.css';
import { useNavigate } from 'react-router-dom';
import NameAnimation from '../components/NameAnimation';
import BackButton from '../components/BackButton';

//Define the VehiclesDetails component
const VehiclesDetails = () => {
    //Initialize state variables
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    //Navigate
    const navigate = useNavigate();

    const handleHomeClick = () => {
        if (window.confirm("When you click HOME you will automatically log out. Do you want to LOGOUT?")) {
            navigate("/");
        }
    };

    //useEffect to fetch vehicle data
    useEffect(() => {
        //Asynchronous function to fetch vehicles from the server
        const fetchVehicles = async () => {
            try {
                //GET request to the server to retrieve vehicle data
                const response = await fetch('http://localhost:3001/vehicles');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched vehicles:', data);
                setVehicles(data);
                setFilteredVehicles(data);
            } catch (error) {
                console.error('Error fetching vehicles:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        //Call the fetchVehicles function
        fetchVehicles();
    }, []); //Empty dependency array

    //useEffect to filter vehicles based on the search term
    useEffect(() => {
        const results = vehicles.filter(vehicle => {
            const vehicleNumber = vehicle.vehicle_number?.toLowerCase() || '';
            const entryBy = vehicle.entry_by?.toLowerCase() || '';

            return vehicleNumber.includes(searchTerm.toLowerCase()) ||
                   entryBy.includes(searchTerm.toLowerCase());
        });
        setFilteredVehicles(results); //Update the filteredVehicles state with the filtered results
    }, [searchTerm, vehicles]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    //if data is still loading
    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container-vehicles">
            <button className='home-button' onClick={handleHomeClick}>HOME</button>
            <BackButton />
            <div id="Company-logo-vehicles">
                <img className='logo' src="cLogo.png" alt="logo" />
            </div>
            <NameAnimation />
            <div id='search-bar-admin'>
                <input
                    type='text'
                    placeholder='Search by Vehicle Number or Entry By...'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='search-bar-admin'
                />
            </div>
            <h1 id='name'>Vehicles Details</h1>
            <table className="table-vehicles">
                <thead>
                    <tr>
                        <th>Vehicle Number</th>
                        <th>Contact Number</th>
                        <th>Entry Time</th>
                        <th>Entry By</th>
                        <th>Exit Time</th>
                        <th>Exit By</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle, index) => (
                            <tr key={index}>
                                <td>{vehicle.vehicle_number}</td>
                                <td>{vehicle.contact_number}</td>
                                <td>{new Date(vehicle.entry_time).toLocaleString()}</td>
                                <td>{vehicle.entry_by}</td>
                                <td>{vehicle.exit_time ? new Date(vehicle.exit_time).toLocaleString() : 'Not exited'}</td>
                                <td>{vehicle.exit_by}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No vehicles found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VehiclesDetails;

