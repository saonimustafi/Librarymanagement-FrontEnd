import React, { useEffect, useState }  from 'react'
import { useParams } from "react-router-dom";
import './UserRequestBucketPage.css';
import TopNav from '../components/TopNav';

const UserRequestBucketPage = () => {
    const [activity, setActivity] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const { user_id } = useParams()
    const [combinedDataFiltered, setCombinedDataFiltered] = useState(null)


    useEffect(() => {
        async function userActivities() {
            try {
                const activityResponse = await fetch(`http://localhost:3000/requests/${user_id}`);
                const activityData = await activityResponse.json();
                const activityDataArr = [activityData]
                setActivity(activityDataArr);

                const bookResponse = await fetch(`http://localhost:3000/books`);
                const bookData = await bookResponse.json();
                const bookDataArr = [bookData]
                setUserBooks(bookDataArr);
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
                    .filter(book => ((book.approvalStatus === 'Pending' || book.approvalStatus === 'Approved') && (book.checkOutDate == null)))
                    .map((book) => ({
                        ...book,
                        bookImage: (book && userBooks && userBooks[0].find(b => b.title === book.title)) ? 
                        userBooks[0].find(b => b.title === book.title).image : ""
                    }))
                }))
                const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                setCombinedDataFiltered(combinedDataModified)
            }
        }
        generateCombinedData()
    }, [activity, userBooks])
    
    
    return (
        <div>
            <TopNav />
            <h2 className="request-table-header">Request Bucket</h2>
          <table className="request-table">
            <thead>
                <tr>
                    <th>Book Image</th>
                    <th>Book Name</th>
                    <th>Requested Date</th>
                    <th>Approval Or Reject Date</th>
                    <th>Approval Status</th>
                    <th>CheckOut Date</th>
                    <th>Comments</th>
                </tr>
            </thead>
            <tbody>
                {
                    
                  (combinedDataFiltered && combinedDataFiltered.length > 0) ? (
                    combinedDataFiltered.map((activityItem) => (
                            activityItem.books.map((book)=> (
                                <tr key = {book.id}>
                                    <td><img src = {book.bookImage} alt = {`${book.bookImage} cover`}/></td>
                                    <td>{book.title}</td>
                                    <td>{(book.requestDate) ? book.requestDate : "-"}</td>
                                    <td>{(book.approvedOrRejectedDate) ? book.approvedOrRejectedDate : "-"}</td>
                                    <td>{book.approvalStatus}</td>
                                    <td>{(book.checkOutDate) ? book.checkOutDate : "-"}</td>
                                    <td>{(book.comments) ? book.comments : ""}</td>
                                </tr>
                            ))
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