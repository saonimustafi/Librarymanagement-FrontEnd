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
    const [returnDateData, setReturnDateData] = useState(null)
    const [currentReturnDates, setCurrentReturnDates] = useState("-")
    const [checkoutDates, setCheckoutDates] = useState({});
    const [approvalRejectionDates, setApprovalRejectionDates] = useState({});
    const [actualReturnDates, setActualReturnDates] = useState({})
    const [approvalStatuses, setApprovalStatuses] = useState({})

   
    const handleShowActivity = async (event) => {
        event.preventDefault();
        
        try {
            const userEmail = event.target.elements.useremail.value;
            const userResponse = await fetch(`http://localhost:3000/users/searchemail/${userEmail}`);
            const userData = await userResponse.json();

            if(userResponse.status === 404) {
                setErrorMessage("User not available")
                setShowTable(false);
            } 
            
            else if(userData !== null) {
                const user = userData.id
                    setUserID(user)
                    setShowTable(true);
            }
        }
        catch(error) {
            console.error(error)
        }
    }

    
    useEffect(() => {
        async function userActivities() {
            try {

                const activityResponse = await fetch(`http://localhost:3000/requests/${userID}`);
                const activityData = await activityResponse.json();
                const activityDataArr = [activityData]
                setActivity(activityDataArr);
    
                const bookResponse = await fetch(`http://localhost:3000/books`);
                const bookData = await bookResponse.json();
                const bookDataArr = [bookData]
                setUserBooks(bookDataArr);

                const responseCheckOut = await fetch(`http://localhost:3000/checkoutdetails/${userID}`)
                const responseCheckOutData = await responseCheckOut.json();
                setReturnDateData(responseCheckOutData)
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
                        userBooks.find(b => b.title === book.title).image : '',
                        
                        bookReturnDate: (book && returnDateData?.[0]?.books.find(b => b.book_id === book.book_id)?.returnDate) ?? '',

                        bookActualReturnDate: (book && returnDateData?.[0]?.books.find(b => b.book_id === book.book_id)?.actualReturnDate) ?? ''
                    }))
                }))

                const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                setCombinedDataFiltered(combinedDataModified)
            }
        }
        generateCombinedData()
    },[activity, userBooks, returnDateData]);



    const handleApprove = async(bookID) => {
        try {
            const response = await fetch(`http://localhost:3000/requests/approveindividualrequest/${userID}/${bookID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                  }
            })

            const ResponseData = await response.json()

            const newApprovalDates = {...approvalRejectionDates, [bookID]: ResponseData.approvalDate}
            await setApprovalRejectionDates(newApprovalDates)

            const newApprovalStatuses = {...approvalStatuses, [bookID]: ResponseData.approvalStatus}
            await setApprovalStatuses(newApprovalStatuses)

            alert("Request Approved")
        }
        catch(error) {
            console.error(error)
        }
    }

    // useEffect(() => {
    //     const updateApprovalStatuses = async(bookID) => {
    //       try {
    //         const response = await fetch(`http://localhost:3000/checkoutdetails/${userID}`, {
    //           method: 'GET',
    //           headers: {
    //             'Content-Type': 'application/json'
    //           }
    //         });
      
    //         const responseData = await response.json();
    //         const newApprovalStatuses = {...approvalStatuses, [bookID]: responseData.approvalStatus};
    //         setApprovalStatuses(newApprovalStatuses);
    //       } catch(error) {
    //         console.error(error);
    //       }
    //     };
      
    //     // for (bookID in approvalRejectionDates) {
    //     //   updateApprovalStatuses(bookID);
    //     // approvalRejectionDates,}
    // }, [ userID, approvalStatuses]);


    const handleReject = async(bookID) => {
        try {
            const response = await fetch(`http://localhost:3000/requests/declineindividualrequest/${userID}/${bookID}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                  }
            })

            const ResponseData = await response.json()
            const newRejectDates = {...approvalRejectionDates, [bookID]: ResponseData.rejectDate}
            setApprovalRejectionDates(newRejectDates)
            

            const newApprovalStatuses = {...approvalStatuses, [bookID]: ResponseData.approvalStatus}
            setApprovalStatuses(newApprovalStatuses)

            alert("Request Declined")
        }
        catch(error) {
            console.error(error)
        }
    }



    const handleCheckOut = async(bookID) => {
        try {
            const responseCheckOutDate = await fetch(`http://localhost:3000/checkout/${userID}/${bookID}`,
            {
                method: 'PUT',
                header: {
                    'Content-Type': 'application/json'
                }
            })


            const ResponseData = await responseCheckOutDate.json()
            
            const newCheckoutDates = {...checkoutDates, [bookID]: ResponseData.checkOutDate}
            setCheckoutDates(newCheckoutDates)

            const newReturnDates = {...currentReturnDates, [bookID]: ResponseData.returnDate}
            setCurrentReturnDates(newReturnDates)

            alert("Book checked out")
        }
        catch(error) {
            console.error(error)
        }
    }


    const handleReturn = async(bookID) => {
        try {
            const responseActualReturnDate = await fetch(`http://localhost:3000/return/${userID}/${bookID}`,
            {
                method: 'PUT',
                header: {
                    'Content-Type': 'application/json'
                }
            })


            const ResponseData = await responseActualReturnDate.json()
            
            const newActualReturnDates = {...actualReturnDates, [bookID]: ResponseData.actualReturnDate}
            setActualReturnDates(newActualReturnDates)

            alert("Book returned")
        }
        catch(error) {
            console.error(error)
        }
    }

    const handleRenew = async(bookID) => {
        try {
            const responseRenewDate = await fetch(`http://localhost:3000/activities/renew/${userID}/${bookID}`,
            {
                method: 'PUT',
                header: {
                    'Content-Type': 'application/json'
                }
            })

            const ResponseData = await responseRenewDate.json()
            const newReturnDates = {...currentReturnDates, [bookID]: ResponseData.newReturnDate}
            setCurrentReturnDates(newReturnDates)

            alert("Book renewed")
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
                    <th>Approval/Rejection Date</th>
                    <th>Approval Status</th>
                    <th>CheckOut Date</th>
                    <th>Return Date</th>
                    <th>Actual Return Date</th>
                    <th>Actions</th>
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

                                    <td>{(book.approvedOrRejectedDate) ? book.approvedOrRejectedDate : (approvalRejectionDates[book.book_id] ? new Date(approvalRejectionDates[book.book_id]).toISOString() : "-")}</td>

                                    <td>{approvalStatuses[book.book_id] ? approvalStatuses[book.book_id] : ((book.approvalStatus)? book.approvalStatus : "-")}</td>

                                    <td>{(book.checkOutDate)? book.checkOutDate : (checkoutDates[book.book_id] ? new Date(checkoutDates[book.book_id]).toISOString() : "-")}</td>

                                    <td>{currentReturnDates[book.book_id] ? new Date(currentReturnDates[book.book_id]).toISOString() : (book.bookReturnDate? book.bookReturnDate : "-")}</td>

                                    <td>{(book.bookActualReturnDate)? book.bookActualReturnDate : (actualReturnDates[book.book_id] ? new Date(actualReturnDates[book.book_id]).toISOString() : "-")}</td>

                                    <td>{
                                       book.approvalStatus === 'Pending' ? (
                                        <>
                                            <button id="approveButton" onClick={() => handleApprove(book.book_id)}>Approve</button>
                                            <button id="rejectButton" onClick={() => handleReject(book.book_id)}>Decline</button>
                                        </>
                                        ) : 
                                            book.approvalStatus === 'Approved' && book.checkOutDate === null ? (
                                                <td>
                                                    <button id="checkoutButton" onClick={() => handleCheckOut(book.book_id)}>Checkout</button>
                                                </td>
                                            )    
                                        : book.checkOutDate && !book.bookActualReturnDate ? (
                                            <td>
                                                <button id="returnButton" onClick={() => handleReturn(book.book_id)}>Return</button>
                                                <button id="renewButton" onClick={() => handleRenew(book.book_id)}>Renew</button>
                                            </td>
                                            ) : 
                                        (
                                            <td></td>
                                            )
                                    }
                                    </td>
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