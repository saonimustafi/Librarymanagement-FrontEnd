import React, { useEffect, useState }  from 'react'
import { useParams } from "react-router-dom";
import './UserRequestBucketPage.css';

const UserRequestBucketPage = () => {
    const [activity, setActivity] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const { user_id } = useParams()
    const [combinedDataFiltered, setCombinedDataFiltered] = useState(null)


    useEffect(() => {
        async function userActivities() {
            try {
                const activityResponse = await fetch(`http://localhost:3004/userActivities?user_id=${user_id}`);
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
    }, [user_id])

    
    useEffect(() => {
        function generateCombinedData() {
            
            if (activity && userBooks) {
                const combinedData = activity
                .map((activityItem) => ({
                    ...activityItem,
                    books: activityItem.books
                    .filter(book => ((book.approvalStatus === 'Pending' ||book.approvalStatus === 'Approved')&&(book.checkoutDate === "")))
                    .map((book) => ({
                        ...book,
                        bookImage: (book && userBooks.find(b => b.title === book.bookName)) ? 
                        userBooks.find(b => b.title === book.bookName).image : ''
                    }))
                }))
                const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                setCombinedDataFiltered(combinedDataModified)
            }
        }
        generateCombinedData()
    },[activity, userBooks])
    
    
    return (
        <div>
            <h2 className="request-table-header">Request Bucket</h2>
          <table className="request-table">
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
                    
                  (combinedDataFiltered && combinedDataFiltered.length > 0) ? (
                    combinedDataFiltered.map((activityItem) => (
                        <React.Fragment key = {activityItem.user_id}>
                            <tr>
                                <td rowSpan = {activityItem.books.length}>{activityItem.user_id}</td>
                                <td> <img src = {activityItem.books[0].bookImage} alt = {`${activityItem.books[0].bookName} cover`}/> </td>
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
                        (combinedDataFiltered && combinedDataFiltered.length === 0) ? (
                        <tr>
                            <td colSpan="8">No request exists for user</td>
                        </tr>
                        ) : (
                        <tr>
                            <td colSpan="8">Loading...</td>
                        </tr>
                    )
                  )
                }
            </tbody>
          </table>
        </div>
    )
}

export default UserRequestBucketPage;