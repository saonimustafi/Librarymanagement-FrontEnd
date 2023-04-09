import React, { useEffect, useState }  from 'react'
import { useParams } from "react-router-dom";
import './UserActivitiesPage.css';

const UserActivitiesPage = () => {
    const [activity, setActivity] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const { user_id } = useParams()
    const [combinedDataFiltered, setCombinedDataFiltered] = useState(null)
    const [returnDateData, setReturnDateData] = useState(null)

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

                const responseCheckOut = await fetch(`http://localhost:3000/checkoutdetails/${user_id}`)
                const responseCheckOutData = await responseCheckOut.json();
                setReturnDateData(responseCheckOutData)
            }
            catch(error) {
                console.error(error)
            }
        }
        userActivities()
    }, [user_id])


    useEffect(() => {
        function generateCombinedData() {
            if (activity && userBooks && returnDateData) {
                const combinedData = activity
                .map((activityItem) => ({
                    ...activityItem,
                    books: activityItem.books
                    .filter(book => ((book.approvalStatus === "Approved" && book.checkOutDate !== null)||(book.approvalStatus === 'Declined')))
                    .map((book) => ({
                        ...book,

                        bookImage: (book && userBooks.find(b => b.title === book.title)) ? 
                        userBooks.find(b => b.title === book.title).image : '',

                        bookReturnDate: (book && returnDateData[0].books.find(b => b.book_id === book.book_id)) ?
                        returnDateData[0].books.find(b => b.book_id === book.book_id).returnDate : ''
                    }))
                }))
                const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                setCombinedDataFiltered(combinedDataModified)
            }
        }
        generateCombinedData()
    },[activity, userBooks, returnDateData])
     
    return (
        <div>
          <h2 className='activity-table-header'>Activity History</h2>
          <table className="activity-table">
            <thead>
                <tr>
                    <th>Book Image</th>
                    <th>Book Name</th>
                    <th>Requested Date</th>
                    <th>Approval Date</th>
                    <th>Approval Status</th>
                    <th>CheckOut Date</th>
                    <th>Return Date</th>
                    <th>Actual Return Date</th>
                    <th>Comments</th>
                </tr>
            </thead>
            <tbody>
                {
                  combinedDataFiltered ? (
                    combinedDataFiltered.map((activityItem) => (    
                            activityItem.books.map((book)=> (
                                <tr key = {book.book_id}>
                                    <td><img src = {book.bookImage} alt = {`${book.bookName} cover`}/></td>
                                    <td>{book.title}</td>
                                    <td>{book.requestDate}</td>
                                    <td>{(book.approvedOrRejectedDate) ? book.approvedOrRejectedDate : "-"}</td>
                                    <td>{book.approvalStatus}</td>
                                    <td>{(book.checkOutDate)? book.checkOutDate : "-"}</td>
                                    <td>{(book.bookReturnDate) ? book.bookReturnDate : "-"}</td>
                                    <td>{(book.actualReturnDate)? book.actualReturnDate : "-"}</td>
                                    <td>{(book.comments) ? book.comments : ""}</td>
                                </tr>
                            ))
                    ))
                  ) : 
                    (
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
      );
}

export default UserActivitiesPage;

