import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import SearchPage from './pages/SearchPage';
import RegisterUserPage from './pages/RegisterUserPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
