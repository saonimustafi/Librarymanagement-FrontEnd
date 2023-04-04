import React, { useEffect, useState }  from 'react'
// import { books } from '../data/books'
import './UserActivitiesPageAdmin.css';


const UserActivitiesPageAdmin = () => {
    const [activity, setActivity] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const [combinedDataFiltered, setCombinedDataFiltered] = useState(null)
    const [showTable, setShowTable] = useState(false)
    const [userID, setUserID] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");

    const handleShowActivity = async (event) => {
        event.preventDefault();
        
        try {
            const userEmail = event.target.elements.useremail.value;
            const userResponse = await fetch(`http://localhost:3001/users/searchemail/${userEmail}`);
            const userData = await userResponse.json();

            if(userData !== null) {
                const user = userData.id
                    setUserID(user)
                    setShowTable(true);
            }
            else {
                setErrorMessage("User not available")
                setShowTable(false);
            }
        }
        catch(error) {
            console.error(error)
        }
    }

    
    useEffect(() => {
        async function userActivities() {
            try {

                const activityResponse = await fetch(`http://localhost:3001/requests/${userID}`);
                const activityData = await activityResponse.json();
                const activityDataArr = [activityData]
                setActivity(activityDataArr);
    
                const bookResponse = await fetch(`http://localhost:3001/books`);
                const bookData = await bookResponse.json();
                const bookDataArr = [bookData]
                setUserBooks(bookDataArr);
            }
            catch(error) {
                console.error(error)
            }
        }
        userActivities()
    }, [userID])


    useEffect(() => {
        function generateCombinedData() {
            
            if (activity && userBooks) {
                const combinedData = activity
                .map((activityItem) => ({
                    ...activityItem,
                    books: activityItem.books
                    .map((book) => ({
                        ...book,
                        bookImage: (book && userBooks.find(b => b.title === book.title)) ? 
                        userBooks.find(b => b.title === book.title).image : ''
                    }))
                }))
                const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                setCombinedDataFiltered(combinedDataModified)
            }         
        }
        generateCombinedData()
    },[activity, userBooks]);

    const handleApprove = async(bookID) => {
        try {
            const response = await fetch(`http://localhost:3001/requests/approveindividualrequest/${userID}/${bookID}`, 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                  }
            })

            const ResponseData = await response.json()
            console.log("Request Approved")
        }
        catch(error) {
            console.error(error)
        }
    }

    const handleReject = async(bookID) => {
        try {
            const response = await fetch(`http://localhost:3001/requests/declineindividualrequest/${userID}/${bookID}`, 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                  }
            })

            const ResponseData = await response.json()
            console.log("Request Declined")
        }
        catch(error) {
            console.error(error)
        }
    }

    return (
        <> 
        <div>
            <h2 className = 'activity-table-admin-header'>Activity History</h2>
            <form className = 'activity-table-admin-form' onSubmit={handleShowActivity}>
                <label className = 'activity-table-admin-label' htmlFor = "userEmail">User Name:</label>
                <input type = "text" id = "userEmailInput" name="useremail"></input>
                <button id="myButton" type="submit">Show</button>
            </form>
        </div>

          <div>
          
          {showTable ? (
          <table className = "activity-table-admin">
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
                    <th>Approve/Reject</th>
                </tr>
            </thead>
            <tbody>
                {
                  combinedDataFiltered ? (
                    combinedDataFiltered.map((activityItem) => (
                        activityItem.books.map((book)=> (
                                <tr key = {book.book_id}> 
                                    <td><img src = {book.bookImage} alt = {`${book.title} cover`}/></td>
                                    <td>{book.title}</td> 
                                    <td>{book.requestDate}</td>
                                    <td>{(book.approvedOrRejectedDate) ? book.approvedOrRejectedDate : "-"}</td>
                                    <td>{book.approvalStatus}</td>
                                    <td>{(book.checkOutDate)? book.checkOutDate : "-"}</td>
                                    <td>{(book.returnDate) ? book.returnDate : "-"}</td>
                                    <td>{(book.actualReturnDate)? book.actualReturnDate : "-"}</td>
                                    {
                                       book.approvalStatus === 'Pending' ? (
                                        <td>
                                            <button id="approveButton" onClick={() => handleApprove(book.id)}>Approve</button>
                                            <button id="rejectButton" onClick={() => handleReject(book.id)}>Decline</button>
                                        </td>
                                       ) :
                                       (<td></td>)
                                    }
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
          ) : (
            errorMessage && <div className="activity-table-error">{errorMessage}</div>
          )
          }
        </div>
        </>
      );
}

export default UserActivitiesPageAdmin;