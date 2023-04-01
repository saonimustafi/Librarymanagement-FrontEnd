import React, { useEffect, useState }  from 'react'
// import { books } from '../data/books'
import './UserActivitiesPage.css';


const UserActivitiesPageAdmin = () => {
    const [activity, setActivity] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const [combinedDataFiltered, setCombinedDataFiltered] = useState(null)
    // const [userEmail, setUserEmail] = useState("")
    const [showTable, setShowTable] = useState(false)
    const [userID, setUserID] = useState(null)

    const handleShowActivity = async (event) => {
        event.preventDefault();
        // setUserEmail(event.target.value)
        
        try {
            const userEmail = event.target.elements.useremail.value;
            const userResponse = await fetch(`http://localhost:3004/users?email=${userEmail}`);
            const userData = await userResponse.json();

            if(userData) {
                const user = (userData && userData.find(usr => usr.email === userEmail))? userData[0].id:""
                if (user !== "")
                    setUserID(user)
                else {
                    console.error("User does not exist")
                }
            }
            else {
                console.log("No user data present")
            } 

        }
        catch(error) {
            console.error(error)
        }
        setShowTable(true);
        this.forceUpdate();
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
            <form onSubmit={handleShowActivity}>
                <label htmlFor = "userEmail">User Name:</label>
                <input type = "text" id = "userEmailInput" name="useremail"></input>
                <button id="myButton" type="submit">Show Activity History</button>
            </form>
        </div>

          <div>
          <h2 className = 'activity-table-header'>Activity History</h2>
          {showTable &&
          <table className = "activity-table">
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
                  combinedDataFiltered ? (
                    combinedDataFiltered.map((activityItem) => (
                        <React.Fragment key = {activityItem.useremail}>
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
                                    <td><img src = {book.bookImage} alt = {`${book.bookName} cover`}/></td>
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
          }
        </div>
        </>
      );
}

export default UserActivitiesPageAdmin;