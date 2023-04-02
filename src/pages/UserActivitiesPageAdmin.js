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
            const userResponse = await fetch(`http://localhost:3004/users?email=${userEmail}`);
            const userData = await userResponse.json();

            if(userData && userData.length > 0) {
                const user = (userData && userData.find(usr => usr.email === userEmail))? userData[0].id:""
                if (user !== "") {
                    setUserID(user)
                    setShowTable(true);
                }
            }
            else {
                setErrorMessage("User not available")
                setShowTable(false);
            } 

        }
        catch(error) {
            console.error(error)
            setShowTable(false);
        }
    }

        useEffect(() => {
            async function userActivities() {
                try {

                    const activityResponse = await fetch(`http://localhost:3004/userActivities?user_id=${userID}`);
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
                            bookImage: (book && userBooks.find(b => b.title === book.bookName)) ? 
                            userBooks.find(b => b.title === book.bookName).image : ''
                        }))
                    }))
                    const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                    setCombinedDataFiltered(combinedDataModified)
                }         
            }
            generateCombinedData()
        },[activity, userBooks]);
    


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
                </tr>
            </thead>
            <tbody>
                {
                  combinedDataFiltered ? (
                    combinedDataFiltered.map((activityItem) => (
                        activityItem.books.map((book)=> (
                                <tr key = {book.id}> 
                                    <td><img src = {book.bookImage} alt = {`${book.bookName} cover`}/></td>
                                    <td>{book.bookName}</td> 
                                    <td>{book.dateRequested}</td>
                                    <td>{book.approvalDate}</td>
                                    <td>{book.approvalStatus}</td>
                                    <td>{book.checkoutDate}</td>
                                    <td>{book.returnDate}</td>
                                    <td>{(book.actualReturnDate)? book.actualReturnDate : null}</td>
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