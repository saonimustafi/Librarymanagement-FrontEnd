import React, { useEffect, useState } from "react";
import './CheckUserFinePageAdmin.css'

const Example = () => {

    const [userActivityList, setUserActivityList] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const [combinedDataFiltered, setCombinedDataFiltered] = useState(null)
    const [showTable, setShowTable] = useState(false)
    const [userID, setUserID] = useState(null)
    const [errorMessage, setErrorMessage] = useState("");

    const handleShowActivity = async (event) => {
        event.preventDefault();

        try {
            const userEmail = event.target.elements.fineUserEmail.value;
            const userResponse = await fetch(`http://localhost:3004/users?email=${userEmail}`);
            const userData = await userResponse.json();

            if(userData && userData.length > 0) {
                const user = (userData && userData.find(usr => usr.email === userEmail))? userData[0].id : ""
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
        }
    }

    useEffect(() => {
        async function fetchDetails() {
            try {
            const activityListResponse = await fetch(`http://localhost:3004/userActivities?user_id=${userID}`)
            const activityListData = await activityListResponse.json();
            setUserActivityList(activityListData);

            const bookResponse = await fetch("http://localhost:3004/books");
            const bookData = await bookResponse.json();
            setUserBooks(bookData);
            }
            catch(error) {
                console.error(error)
            }
        }
        fetchDetails();
    }, [userID])

    useEffect(() => {
        function generateCombinedData() {

            if(userActivityList && userBooks)  {
                const combinedData = 
                userActivityList.map((activityListItem) => ({
                    ...activityListItem,
                    books: activityListItem.books.map((book) => ({
                        ...book,
                        bookImage: userBooks.find(b => b.title === book.bookName)?.image || ''}))
                    }))
                    const combinedDataModified = (combinedData) ? combinedData.filter(data => data.books.length !== 0) : null
                    setCombinedDataFiltered(combinedDataModified)
            }
        }
        generateCombinedData()
    }
    , [userActivityList, userBooks]
    )

    return(
        <>
            <div>
                <h2 className="fine-table-header">User Fine</h2>
                <form className = 'fine-table-admin-form' onSubmit={handleShowActivity}>
                    <label className = 'fine-table-admin-label' htmlFor = "fineUserEmail">User Name:</label>
                    <input type = "text" id = "fineUserEmailInput" name="fineUserEmail"></input>
                    <button id="myButtonFine" type="submit">Show</button>
            </form>
            </div>

            <div>
                {showTable ? (
                <table className="fine-table">
                    <thead>
                        <tr>
                            <th>Book Image</th>
                            <th>Book Name</th>
                            <th>Check Out Date</th>
                            <th>Return Date</th>
                            <th>Actual Return Date</th>
                            <th colSpan="9">Fine</th>
                        </tr>
                        </thead>
                            <tbody>
                                {
                                combinedDataFiltered ? 
                                ( combinedDataFiltered.map((activityListItem) => (
                                    activityListItem.books.map((book) => (
                                        <tr key = {book.id}>
                                            <td><img src = {book.bookImage} alt = {`${book.bookName} cover`}/></td>
                                            <td>{book.bookName}</td>
                                            <td>{book.checkoutDate}</td>
                                            <td>{book.returnDate}</td>
                                            <td>{book.actualReturnDate}</td>
                                            <td colSpan="8">{book.fineToPay}</td>
                                        </tr>
                                    ))
                                ))) :
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
                                {
                                    combinedDataFiltered && (
                                        <tr>
                                            <td id="fine-table-total-fine" colSpan="8">Total Fine</td>
                                            <td>
                                                {
                                                    combinedDataFiltered
                                                    .flatMap((activityItem) => activityItem.books)
                                                    .reduce((totalFine, book) => totalFine + (book.fineToPay || 0),0)
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                </table>
                )
                : (
                errorMessage && <div className="fine-table-error">{errorMessage}</div>
                )
                }    
            </div>
        </>
    )
}

export default Example;
