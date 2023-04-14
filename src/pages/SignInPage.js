import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignInPage.css';

function LoginUser() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    
    const response = await fetch('http://127.0.0.1:3000/users/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user)
			// alert('Login successful')
			window.location.href = '/'
		} else {
			alert('Please check your username and password')
		}
  };

  return (
    <div className="sign-in-page">
      <h2 className="sign-in-heading">Sign In</h2>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="sign-in-error">{errorMessage}</p>}
        <label htmlFor="email" className="sign-in-label">Email:</label>
        <input
          type="email"
          id="email"
          className="sign-in-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="sign-in-label">Password:</label>
        <input
          type="password"
          id="password"
          className="sign-in-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="sign-in-button">Sign In</button>
      </form>
      <div className="sign-in-links">
        <Link to="/forgot-password" className="sign-in-link">Forgot Password?</Link>
        <Link to="/register" className="sign-in-link">New user? Register</Link>
      </div>
    </div>
  );
}

export default LoginUser;











