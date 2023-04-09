import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './BookDetailPage.css';

function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(`http://localhost:3000/books/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.log('Error:', error);
      }
    }
    fetchBook();
  }, [id]);

  return (
    <div className="book-detail-page">
      {book ? (
        <>
          <img src={book.image} alt={book.title} />
          <div className="book-detail-info">
            <h2 className="book-detail-title">{book.title}</h2>
            <p className="book-detail-author">{book.author}</p>
            <p className="book-detail-description">{book.description}</p>
            <button className="book-detail-button">Add to Cart</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default BookDetailPage;
