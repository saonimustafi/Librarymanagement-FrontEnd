import React, { useEffect, useState }  from 'react'
import { books } from '../data/books';
import './UserActivitiesPage.css';

const UserActivitiesPage = () => {
    const [activity, setActivity] = useState(null)

    useEffect(() => {
        async function userActivities() {
            try {
                const response = await fetch(`http://localhost:3004/userActivities`);
                const data = await response.json();
                setActivity(data);
            }
            catch(error) {
                console.error(error)
            }
        }
        userActivities()
    }, [])

    return (
        <div>

          <h2>Activity History</h2>
          <table className="activity-table">
            <thead>
                <tr>
                <th>User ID</th>
                <th>Book Name</th>
                <th>Requested Date</th>
                <th>Approval Date</th>
                <th>Approval Status</th>
                <th>CheckOut Date</th>
                <th>Return Date</th>
                </tr>
            </thead>
            <tbody>
                {
                  activity ? 
                  (
                    activity.map((activityItem) => {
                        const { user_id, books } = activityItem;
                        return (
                            <React.Fragment key = {user_id}>
                                <tr>
                                    <td rowSpan={books.length}>{user_id}</td>
                                    <td>{books[0].bookName}</td>
                                    <td>{books[0].dateRequested}</td>
                                    <td>{books[0].approvalDate}</td>
                                    <td>{books[0].approvalStatus}</td>
                                    <td>{books[0].checkoutDate}</td>
                                    <td>{books[0].returnDate}</td>
                                </tr>
                                {
                                    books.slice(1).map((book) => (
                                        <tr key = {`${user_id}-${book.bookName}`}>
                                            <td>{book.bookName}</td>
                                            <td>{book.dateRequested}</td>
                                            <td>{book.approvalDate}</td>
                                            <td>{book.approvalStatus}</td>
                                            <td>{book.checkoutDate}</td>
                                            <td>{book.returnDate}</td>
                                        </tr>
                                    ))
                                }
                            </React.Fragment>
                        )
                    })
                    ):(
                    <tr>
                      <td colSpan="10">Loading...</td>
                    </tr>
                  )
                }
            </tbody>
          </table>
        </div>
      );
}

export default UserActivitiesPage;

