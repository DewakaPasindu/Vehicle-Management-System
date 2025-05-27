//import react, hooks, and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./dashboard.css";
import Calendar from '../components/Calendar';
import DigitalClock from '../components/DigitalClock';
import { useNavigate } from 'react-router-dom';
import NameAnimation from '../components/NameAnimation';

//Main function
export default function Dashboard() {
    const navigate = useNavigate();

    //State to manage filled spaces, initialized from localStorage if available
    const [filledSpaces, setFilledSpaces] = useState(() => {
        const saved = localStorage.getItem('filledSpaces');
        return saved !== null ? JSON.parse(saved) : 0;
    });

    //State to manage total spaces, initialized from localStorage if available
    const [totalSpaces, setTotalSpaces] = useState(() => {
        const saved = localStorage.getItem('totalSpaces');
        return saved !== null ? JSON.parse(saved) : 100;
    });

    //State to manage the vehicle number input field and contact number input field
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    
    //State to manage the username, initialized from localStorage if available
    const [username] = useState(() => {
        return localStorage.getItem('username') || '';
    });

    //UseEffect to save filledSpaces and totalSpaces to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('filledSpaces', JSON.stringify(filledSpaces));
        localStorage.setItem('totalSpaces', JSON.stringify(totalSpaces));
    }, [filledSpaces, totalSpaces]);

    //UseEffect to redirect to login page if username is not found in localStorage
    useEffect(() => {
        if (!username) {
            navigate('/');
        }
    }, [navigate, username]);

    //Function to validate Sri Lanka Vehicle Number Plate
    const isValidVehicleNumber = (number) => {
        const vehicleNumberPattern = /^[A-Z]{1,2}-?[A-Z]{1,2}-?\d{4}$/;
        return vehicleNumberPattern.test(number);
    };

    //Function to validate Sri Lanka Mobile Number
    const isValidContactNumber = (number) => {
        const contactNumberPattern = /^07\d{8}$/;
        return contactNumberPattern.test(number);
    };

    //Function to handle HOME button click
    const handleHomeClick = () => {
        if (window.confirm("When you click HOME you will automatically log out. Do you want to LOGOUT?")) {
            localStorage.removeItem('username'); 
            navigate("/");
        }
    };

    const handleAdminClick = () => {
        navigate("/Admin");
    };

    const handleVehiclesClick = () => {
        navigate("/Vehicles");
    };

    const handleChangeInChargeClick = () => {
        //Clear only the username from local storage to allow new login without resetting other data
        localStorage.removeItem('username'); 
        navigate("/login");
    };

    //Handle UPDATE button for updating total spaces
    const handleUpdateClick = () => {
        const newTotalSpaces = prompt("Enter the new total number of spaces:");
        //Check if input is not null and is a number
        if (newTotalSpaces !== null && !isNaN(newTotalSpaces)) {
            //Store new input as number
            const newTotal = Number(newTotalSpaces);
            setTotalSpaces(newTotal);
            
            //New totalSpace must be greater than filledSpace
            if (newTotal < filledSpaces) {
                alert("New total spaces cannot be less than filled spaces. Adjusting total spaces to match filled spaces.");
                setTotalSpaces(filledSpaces);
            } else {
                setTotalSpaces(newTotal - filledSpaces);
            }
        } else {
            alert("Please enter a valid number.");
        }
    };

    //Function to handle ENTRY button click
    const handleEntryClick = () => {
        if (totalSpaces === 0) {
            alert("There are no spaces for parking.");
            return;
        }

        if (!vehicleNumber || !contactNumber) {
            alert("Vehicle N. and Contact N. must be filled for ENTRY.");
            return;
        }

        if (!isValidVehicleNumber(vehicleNumber)) {
            alert("Invalid Vehicle Number. Please enter a valid Sri Lankan vehicle number.");
            return;
        }

        if (!isValidContactNumber(contactNumber)) {
            alert("Invalid Contact Number. Please enter a valid Sri Lankan mobile number.");
            return;
        }

        const entryData = {
            vehicleNumber,
            contactNumber
        };

        //Send a POST request to the server to record the entry
        axios.post('http://localhost:3001/entry', entryData, {
            headers: {
                //Include username of the incharj
                username: username
            }
        })
            .then(response => {
                console.log('Entry successful:', response.data);
                alert('Entry recorded successfully.');

                //Update spaces
                setFilledSpaces(filledSpaces + 1);
                setTotalSpaces(totalSpaces - 1);

                setVehicleNumber('');
                setContactNumber('');
            })
            .catch(error => {
                console.error('Error during entry:', error);
                alert('Error during entry. Please try again.');
            });
    };

    //Function to handle EXIT button click
    const handleExitClick = () => {
        if (!vehicleNumber) {
            alert("Vehicle N. must be filled for EXIT.");
            return;
        }

        const exitData = {
            vehicleNumber
        };

        //Send a POST request to the server to record the exit
        axios.post('http://localhost:3001/exit', exitData, {
            headers: {
                //Include username of the incharj
                username: username
            }
        })
            .then(response => {
                console.log('Exit successful:', response.data);
                alert('Exit recorded successfully.');

                //Update spaces
                setFilledSpaces(filledSpaces - 1);
                setTotalSpaces(totalSpaces + 1);

                setVehicleNumber('');
            })
            .catch(error => {
                console.error('Error during exit:', error);
                alert('Error during exit. Please try again.');
            });
    };
    // ============================================================================================
    // Call the endpoint of detecting number plate
    const handleCaptureVehicleNumber = async () => {
        try {
            const response = await axios.post('http://localhost:3001/capture-vehicle-number',{
                script: 'main.py',
            });
            const capturedVehicleNumber = response.data.vehicleNumber;
            setVehicleNumber(capturedVehicleNumber);
            alert('Vehicle number captured: ' + capturedVehicleNumber);
        } catch (error) {
            console.error('Error capturing vehicle number:', error);
            alert('An error occurred while capturing the vehicle number. Please try again.');
        }
    };
    

    return (
        <div>
            <div> 
                <img id='logo' src="cLogo.png" alt="logo"/>
            </div>
            <div className='calendar'>
                <Calendar/>
            </div>
            <div className='clock'>
                <DigitalClock/>
            </div>
            <div className='mainmenu'>
                <button className='navigateButton' onClick={handleHomeClick}>HOME</button>
                <button className='navigateButton' onClick={handleAdminClick}>ADMIN</button>
                <button className='navigateButton' onClick={handleVehiclesClick}>VEHICLES DETAILS</button>
            </div>
            <div id="container-dashboard">
                <div className="sub-box box-1">
                    <p>TOTAL SPACE</p>
                    <div className="totalSpace">
                        {totalSpaces}
                    </div>
                    <button id='updateButton-totalspace' onClick={handleUpdateClick}>UPDATE</button>
                </div>
                <div className="sub-box box-2">
                    <p>FILLED SPACES</p>
                    <div className="totalSpace">
                        {filledSpaces}
                    </div>
                </div>
                <div className="sub-box box-3">
                    <p>INCHARGE</p>
                    <h3 className='incharjUN'>{username}</h3>
                    <button id='changeInChargeButton' onClick={handleChangeInChargeClick}>Change In-Charge</button>
                </div>
                <div className="sub-box box-4">
                    <p>ENTRY or EXIT</p>
                    <div className="alertBox">
                        <div className="input-group">
                            <label htmlFor="vehicle-number">Vehicle N. :</label>
                            <button id='cam' onClick={handleCaptureVehicleNumber} style={{ marginLeft: '115px', backgroundColor:'blue', borderStyle:'none' }}>SCAN</button> 
                            <input
                                type="text"
                                id="vehicle-number"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="contact-number">Contact N. :</label>
                            <input
                                type="text"
                                id="contact-number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>
                        <button className="entry-button" onClick={handleEntryClick}>ENTRY</button>
                        <button className="exit-button" onClick={handleExitClick}>EXIT</button>
                    </div>
                </div>
            </div>
            <NameAnimation/>
        </div>
    );
}