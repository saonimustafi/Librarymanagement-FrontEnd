import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import SearchPage from './pages/SearchPage';
import RegisterUserPage from './pages/RegisterUserPage';
import UserActivitiesPage from './pages/UserActivitiesPage';
import CheckUserFinePage from './pages/CheckUserFinePage';
import UserRequestBucketPage from './pages/UserRequestBucketPage';
import UserActivitiesPageAdmin from './pages/UserActivitiesPageAdmin';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterUserPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/userActivities" element={<UserActivitiesPage />} />
          <Route path="/checkUserFine/:user_id" element={<CheckUserFinePage />}/>
          <Route path="/checkUserRequestBucket/:user_id" element={<UserRequestBucketPage />} />
          <Route path="/userActivitiesAdmin" element={<UserActivitiesPageAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
