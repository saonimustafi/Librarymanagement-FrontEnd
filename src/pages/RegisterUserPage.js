import React, { useState } from 'react';
import './RegisterUserPage.css'


function RegisterUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/newUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
    }
    catch(error) {
      console.log(error)
    }
    console.log('Submitted')
    window.location.href = '/login'
  };

  return (
    <div className="register-page">
      <h1 className="register-heading">Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="register-label">Name:</label>
          <input
            type="text"
            id="name"
            className="register-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
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