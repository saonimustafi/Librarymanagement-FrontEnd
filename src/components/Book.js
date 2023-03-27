import { useState } from 'react';
import './Book.css';

function Book({ book }) {
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState('');
  const [isInCart, setIsInCart] = useState(false);

  const requestBook = async () => {
    try {
      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Request successful');
        setMessage('Item added to cart successfully!');
        setIsInCart(true);        
      } else {
        console.log('Request failed');
        setMessage('Error adding item to cart.');
      }
    } catch (error) {
      console.log('Error:', error);
      setMessage('Error adding item to cart.');
    }
  };

  const deleteRequest = async () => {
    try {
      const response = await fetch('http://localhost:3001/books', {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Request successful');
        setMessage('Request deleted successfully!');
        setIsInCart(false);        
      } else {
        console.log('Request failed');
        setMessage('Error deleting request');
      }
    } catch (error) {
      console.log('Error:', error);
      setMessage('System Error while deleting request.');
    }
  };

  return (
    <div
      className="book"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={book.image} alt={book.title} />
      <div className={`book-info ${isHovered ? 'hovered' : ''}`}>
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">{book.author}</p>
        {/* <p className="book-description">{book.description}</p> */}
        {/* <button onClick={handleButtonClick}>Add to Cart</button> */}
        {isInCart ? (
          <button className="delete-request" onClick={deleteRequest}>Delete request</button>
        ) : (
          <button className="request-book" onClick={requestBook}>Request book</button>
        )}
        {message && <p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}
      </div>
    </div>
  );
}

export default Book;