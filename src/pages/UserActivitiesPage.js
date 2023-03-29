import React, { useEffect, useState }  from 'react'
import { books } from '../data/books';
import './UserActivitiesPage.css';

const UserActivitiesPage = () => {
    const [activity, setActivity] = useState(null)
    const [userBooks, setUserBooks] = useState(null)

    useEffect(() => {
        async function userActivities() {
            try {
                const activityResponse = await fetch(`http://localhost:3004/userActivities`);
                const activityData = await activityResponse.json();
                setActivity(activityData);

                const bookResponse = await fetch(`http://localhost:3004/books`);
                const bookData = await bookResponse.json();
                setUserBooks(bookData);
            }
            catch(error) {
                console.error(error)
            }
        }
        userActivities()
    }, [])

        const combinedData = (activity && userBooks) ? activity.map((activityItem) => ({
            ...activityItem,
            books: activityItem.books.map((book) => ({
                ...book,
                bookImage: userBooks.find(b => b.title === book.bookName)?.image || ''}))
            })) : null
            
    return (
        <div>
          <h2 className='activity-table-header'>Activity History</h2>
          <table className="activity-table">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Book Image</th>
                    <th>Book Name</th>
                    <th>Requested Date</th>
                    <th>Approval Date</th>
                    <th>Approval Status</th>
                    <th>CheckOut Date</th>
                    <th>Return Date</th>
                    <th>Actual Return Date</th>
                </tr>
            </thead>
            <tbody>
                {
                  combinedData ? (
                    combinedData.map((activityItem) => (
                        <React.Fragment key = {activityItem.user_id}>
                            <tr>
                                <td rowSpan = {activityItem.books.length}>{activityItem.user_id}</td>
                                <td> <img src = {activityItem.books[0].bookImage} alt = {`${activityItem.books[0].bookImage} cover`}/> </td>
                                <td>{activityItem.books[0].bookName}</td>
                                <td>{activityItem.books[0].dateRequested}</td>
                                <td>{activityItem.books[0].approvalDate}</td>
                                <td>{activityItem.books[0].approvalStatus}</td>
                                <td>{activityItem.books[0].checkoutDate}</td>
                                <td>{activityItem.books[0].returnDate}</td>
                                <td>{(activityItem.books[0].actualReturnDate)? activityItem.books[0].actualReturnDate : null}</td>
                            </tr>
                            {activityItem.books.slice(1).map((book)=> (
                                <tr key = {`${activityItem.user_id} - ${book.id}`}>
                                    <td><img src = {book.bookImage} alt = {`${book.bookImage} cover`}/></td>
                                    <td>{book.bookName}</td>
                                    <td>{book.dateRequested}</td>
                                    <td>{book.approvalDate}</td>
                                    <td>{book.approvalStatus}</td>
                                    <td>{book.checkoutDate}</td>
                                    <td>{book.returnDate}</td>
                                    <td>{(book.actualReturnDate)? book.actualReturnDate : null}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))
                  ) : (
                    <tr>
                        <td colSpan="8">Loading...</td>
                    </tr>
                  )
                }
            </tbody>
          </table>
        </div>
      );
}

export default UserActivitiesPage;

