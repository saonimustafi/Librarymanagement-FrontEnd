import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Book from '../components/Book';
import TopNav from '../components/TopNav';
// import { books } from '../data/books';
import './HomePage.css';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [books, setBooks] = useState([]);
  const searchRef = useRef(null);
  // const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      // navigate(`/search/${searchTerm}`);
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
        const data = await response.json();
        setBooks(data);
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
        {books.map((book) => (
          <Book key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;