import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './CheckUserFinePage.css'

const CheckUserFinePage = () => {
    const { user_id } = useParams()
    const [userActivityList, setUserActivityList] = useState(null)
    const [userBooks, setUserBooks] = useState(null)

    useEffect(() => {
        async function fetchDetails() {
            try {
            // user_id is being passed as a query parameter here
            const activityListResponse = await fetch("http://localhost:3004/userActivities?:user_id")
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
    }, [user_id])

    const combinedData = 
        (userActivityList && userBooks) ? userActivityList.map((activityListItem) => ({
            ...activityListItem,
            books: activityListItem.books.map((book) => ({
                ...book,
                bookImage: userBooks.find(b => b.title === book.bookName)?.image || ''}))
            }))
    : null

    return(
        <div>
            <h2 className="fine-table-header">User Fine</h2>
            <table className="fine-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Book Image</th>
                        <th>Book Name</th>
                        <th>Return Date</th>
                        <th>Actual Return Date</th>
                        <th>Fine</th>
                    </tr>
                    </thead>
                        <tbody>
                            {
                               combinedData ? 
                               ( combinedData.map((activityListItem) => (
                                    <React.Fragment key={activityListItem.user_id}>
                                        <tr>
                                            <td rowSpan={activityListItem.books.length}>{activityListItem.user_id}</td>
                                            <td><img src = {activityListItem.books[0].bookImage} alt = {`${activityListItem.books[0].bookImage} cover`} /></td>
                                            <td>{activityListItem.books[0].bookName}</td>
                                            <td>{activityListItem.books[0].returnDate}</td>
                                            <td>{activityListItem.books[0].actualReturnDate ? activityListItem.books[0].actualReturnDate : null}</td>
                                            <td>{activityListItem.books[0].fineToPay}</td>
                                        </tr>
                                    
                                        {activityListItem.books.slice(1).map((book) => (
                                            <tr key = {`${activityListItem.user_id} - ${book.id}`}>
                                                <td><img src = {book.bookImage} alt = {`${book.bookImage} cover`}/></td>
                                                <td>{book.bookName}</td>
                                                <td>{book.returnDate}</td>
                                                <td>{book.actualReturnDate}</td>
                                                <td>{book.fineToPay}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                               ))) :
                                (
                                <tr>
                                    <td colSpan="8">Loading...</td>
                                </tr>
                                )
                            }
                        </tbody>  
            </table>
        </div>
    )
}

export default CheckUserFinePage;