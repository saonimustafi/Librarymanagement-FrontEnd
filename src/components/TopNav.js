import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TopNav.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser } from "@fortawesome/free-solid-svg-icons";

function TopNav() {    
    const [isLoggedIn, setIsLoggedIn] = useState([]);
    // const [userEmail, setUserEmail] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate()
    const LOGO_IMG_URL = "data:image/jpeg;base64,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"
    
    function handleDropdown() {
        setShowDropdown(!showDropdown);
      }
    
    async function handleLogout() {
        try {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        } catch {
            console.log("Failed to log out");
        }
    }

    async function checkLoggedIn() {
        const token = localStorage.getItem('token')
        if (token) {
            const req = await fetch('http://127.0.0.1:3000/checkLoggedIn', {
                headers: {
                    'x-access-token': token,
                },
            })
            const data = await req.json()
            if (data.status === 'ok') {
                setIsLoggedIn(true)
                // setUserEmail(data.email)
                setCurrentUser(data)
            } else {
                setIsLoggedIn(false)
                // setUserEmail('')
                setCurrentUser({})
                console.log('Error occurred during user authentication: ' + data.error)
                navigate('/')
            }
		} else {
            setIsLoggedIn(false)
            // setUserEmail('')
            setCurrentUser({})
            // console.log('Error occurred during user authentication: ' + data.error)
            navigate('/')
        }
	}
  
    useEffect(() => {        
        checkLoggedIn();
      }, []);
  
    return (
    <nav className="top-nav">
      <Link to="/" className="logo-link">
        <img src={LOGO_IMG_URL} alt="Company logo" className="logo" />
      </Link>
      <Link to="/" className="company-name">Library Portal</Link>
      {/* <ul className="menu">
        <li className="menu-item">
          <Link to="/categories" className="menu-link">Categories</Link>
        </li>
        <li className="menu-item">
          <Link to="/contact-us" className="menu-link">Contact us</Link>
        </li>
      </ul> */}

      {isLoggedIn ? (
        // <p>Hello, {userEmail}!</p>

          <div className="user-dropdown-container">
          <Link to="#" className="user-dropdown-link" onClick={handleDropdown}>
            <p>Hello, {currentUser.name}</p>
          </Link>
          {showDropdown && (
            <div className="user-dropdown-content">
              {/* <a href="/userActivities/{currentUser.id}">Activity history</a> */}
              <Link to={`/userActivities/${currentUser.id}`}>Activity history</Link>
              <Link to={`/checkUserFine/${currentUser.id}`}>Fines (if any)</Link>
              <Link to={`/checkUserRequestBucket/${currentUser.id}`}>Request bucket</Link>
              <a href="#" onClick={handleLogout}>Log out</a>
              {/* <button onClick={handleLogout}>Log out</button> */}
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="sign-in-link">Sign in</Link>
      )}      
    </nav>
  );
}

export default TopNav;
