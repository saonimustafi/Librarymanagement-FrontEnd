import React, { useState } from 'react';
import './RegisterUserPage.css'

function RegisterUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Submitted');
  };

  return (
    <div className="register-page">
      <h1 className="register-heading">Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="register-label">Username:</label>
          <input
            type="text"
            id="username"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        
          <label htmlFor="email" className="register-label">Email:</label>
          <input
            type="email"
            id="email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        
          <label htmlFor="password" className="register-label">Password:</label>
          <input
            type="password"
            id="password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default RegisterUser;
