import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import './Book.css';

function Book({ book, user_id, isBookRequested, isLoggedIn, isAlreadyBorrowedBookID, isFetchRequestedBooksCompleted }) {
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState('');
  const [showBorrowedMessage, setShowBorrowedMessage] = useState('')
  const [addBookRequest, setAddBookRequest] = useState(null)
  const [showRequestBookButton, setShowRequestBookButton] = useState(true)
  const [showDeleteBookButton, setShowDeleteBookButton] = useState(true)

  useEffect(() => {
    if (isFetchRequestedBooksCompleted) {
      if(isAlreadyBorrowedBookID) {
        console.log('In Book.js')
        console.log('book='+JSON.stringify(book) + ' isAlreadyBorrowedBookIDs = '+isAlreadyBorrowedBookID + ' user_id='+user_id+ ' isBookRequested='+isBookRequested+ ' isLoggedIn='+isLoggedIn+" isFetchRequestedBooksCompleted="+isFetchRequestedBooksCompleted)
        setShowRequestBookButton(false);
        setShowDeleteBookButton(false)
        setShowBorrowedMessage('Book has been borrowed');
      }
      else {
      // setMessage('Book not available in the library. Please contact Admin');
      console.log('In Book.js')
      console.log('book='+JSON.stringify(book) + ' user_id='+user_id+ ' isBookRequested='+isBookRequested+ ' isLoggedIn='+isLoggedIn+" isFetchRequestedBooksCompleted="+isFetchRequestedBooksCompleted)
      setShowRequestBookButton(!isBookRequested);
      }
    }
    // else {
    //   setShowRequestBookButton(!isBookRequested);
    // }
  }
  , [isBookRequested, isFetchRequestedBooksCompleted]
  );

  // useEffect(() => {
  //   if (isFetchRequestedBooksCompleted) {
  //     // setMessage('Book not available in the library. Please contact Admin');
  //     console.log('In Book.js')
  //     console.log('book='+JSON.stringify(book) + ' isAlreadyBorrowedBookIDs = '+isAlreadyBorrowedBookIDs + ' user_id='+user_id+ ' isBookRequested='+isBookRequested+ ' isLoggedIn='+isLoggedIn+" isFetchRequestedBooksCompleted="+isFetchRequestedBooksCompleted)
  //     setShowRequestBookButton(false);
  //     setShowDeleteBookButton(false)
  //     setShowBorrowedMessage('Book has been borrowed');
  //   }

  //   // else {
  //   //   setShowRequestBookButton(!isBookRequested);
  //   // }
  // }, [, isFetchRequestedBooksCompleted]);


  const requestBook = async () => {
    try {
      const response = await fetch(`http://localhost:3000/requests/newrequests/${user_id}/${book.id}`, {
        method: 'POST',
      });

      // if(this.book.count === 0) {
      //   setMessage('Book not available in the library. Please contact Admin');
      //   showRequestBookButton(false)
      // }
      
      const responseData = await response.json();
      setAddBookRequest(responseData)


      if (response.status === 201) {
        console.log('Request successful');
        setMessage('Book requested successfully!');
        setShowRequestBookButton(false)       
      } 
      else if (response.status === 404) {
        setMessage('Book Not Found');
        setShowRequestBookButton(false)
      }
      else if (response.status === 200 && (addBookRequest && addBookRequest.message === "Book not available in the library")) {
        setMessage('Book not available in the library. Please contact Admin');
        showRequestBookButton(false)
      }
      else if (response.status === 400 && (addBookRequest && addBookRequest.message === "Cannot add the book to the request bucket as it already exists for the user")) {
        console.log('Request failed');
        setMessage('Book already exists for the user');
      }
      else if (response.status === 400 && (addBookRequest && addBookRequest.message === "Cannot add book. Book already borrowed")) {
        console.log('Request failed');
        setMessage('Book already borrowed the user');
      }
    } catch (error) {
      console.log('Error:', error);
      setMessage('Error adding item to cart.');
    }
  };

  const deleteRequest = async () => {
    try {
      const response = await fetch(`http://localhost:3000/requests/deleterequests/${user_id}/${book.id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        console.log('Request successful');
        setMessage('Book Request deleted successfully!'); 
        setShowDeleteBookButton(false);  
      } 
      
      else if (response.status === 404) {
        console.log('Book not found');
        setMessage('Book has not been requested');
      }
    } catch (error) {
      console.log('Error:', error);
      setMessage('Something is wrong');
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

        {console.log("CP1: Book.js: book.title="+book.title+" isBookRequested=" + isBookRequested + " showRequestBookButton="+showRequestBookButton+ 
        " isFetchRequestedBooksCompleted="+isFetchRequestedBooksCompleted+" isLoggedIn="+isLoggedIn)}

        {isLoggedIn && !isBookRequested && showRequestBookButton ? 
        (
          <button className="request-book" onClick={requestBook}>Request book</button>
        ) : 
        isLoggedIn && isAlreadyBorrowedBookID ?
        (
          showBorrowedMessage && <p className="borrowed-message">{showBorrowedMessage}</p>
        )  :
        isLoggedIn && isBookRequested && showDeleteBookButton? (
          <button className="delete-request" onClick={deleteRequest}>Delete request</button>
        ) :
        
        (
          <>
          </>
        )
      }
        {message && <p className={message.includes('Error') ? 'error' : 'success'}>{message}</p>}
      </div>
    </div>
  );
}

export default Book;