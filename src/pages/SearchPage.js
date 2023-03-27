import React, { useState } from 'react';
import BookList from '../components/BookList';
import { searchBooks } from '../utils/api';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    const results = await searchBooks(query);
    setBooks(results);
  };

  return (
    <div>
      <h1>Search for Books</h1>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <BookList books={books} />
    </div>
  );
}

export default SearchPage;
