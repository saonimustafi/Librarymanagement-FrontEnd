import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Book from '../components/Book';
import TopNav from '../components/TopNav';
import './HomePage.css';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [books, setBooks] = useState([]);
  const [requestedBookIDs, setRequestedBookIDs] = useState([]);
  const [isFetchRequestedBooksCompleted, setIsFetchRequestedBooksCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {        
    async function checkLoggedInAndFetchUserRequests() {
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
                setCurrentUser(data)
                
                try {
                    const response = await fetch(`http://localhost:3000/requests/${data.id}`)
                    const responseData = await response.json()
                    const bookIDs = (responseData && responseData.books) ? responseData.books.map((request) => request.book_id) : [];                    
                    setRequestedBookIDs(bookIDs)
                    setIsFetchRequestedBooksCompleted(true)
                }
                catch(error) {
                    console.error(error);
                }
                
            } else {
                setIsLoggedIn(false)
                setCurrentUser({})
                console.log('Error occurred during user authentication: ' + data.error)
                navigate('/')
            }
        } 
        else {
            setIsLoggedIn(false)
            setCurrentUser({})
            navigate('/')
        }
    }
    
    checkLoggedInAndFetchUserRequests();
}, []);



  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/search?search_query=${searchTerm}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.log('Error:', error);
      }
      setSearchTerm('');
    }
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setExpanded(false);
    }
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const response = await fetch(`http://127.0.0.1:3000/search?search_query=`);
        const allBooks = await response.json();
        setBooks(allBooks);
      } catch (error) {
        console.log('Error:', error);
      }
    }
    fetchInitialData();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="home-page">
      <TopNav />
      <div className={`search-bar-container${expanded ? ' expanded' : ''}`} ref={searchRef}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => setExpanded(true)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="book-grid">
        {isLoggedIn ? (
          !isFetchRequestedBooksCompleted ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* {console.log("In HomePage.js: requestedBookIDs=" + requestedBookIDs)} */}
              {books.map((book) => {
                const isBookRequested = requestedBookIDs.includes(book.id);
                // {console.log("In HomePage.js: book=" + book.title + " id="+book.id+" isBookRequested="+isBookRequested)}
                return (
                  <Book
                    key={book.id}
                    book={book}
                    user_id={currentUser.id}
                    isBookRequested={isBookRequested}
                    isLoggedIn={isLoggedIn}
                  />
                );
              })}
            </>
          )
        ) : 
        (
          <>
            {books.map((book) => {
              return (
                <Book
                  key={book.id}
                  book={book}
                  user_id={currentUser.id}
                  isLoggedIn={isLoggedIn}
                  isFetchRequestedBooksCompleted={isFetchRequestedBooksCompleted}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;