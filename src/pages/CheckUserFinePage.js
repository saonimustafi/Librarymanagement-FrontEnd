import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './CheckUserFinePage.css'

const CheckUserFinePage = () => {
    const { user_id } = useParams()
    const [userFineList, setUserFineList] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const [combinedData, setCombinedData] = useState(null)

    useEffect(() => {
        async function fetchDetails() {
            try {
            // user_id is being passed as a query parameter here
            const userFineResponse = await fetch(`http://localhost:3001/getfinedetails/${user_id}`)
            const userFineData = await userFineResponse.json();
            const userFineDataArr = [userFineData]
            setUserFineList(userFineDataArr);

            const bookResponse = await fetch("http://localhost:3001/books");
            const bookData = await bookResponse.json();
            const bookDataArr = [bookData]
            setUserBooks(bookDataArr);
            }
            catch(error) {
                console.error(error)
            }
        }
        fetchDetails();
    }, [user_id])

    useEffect(() => {
        function generateCombinedData() {

            if(userFineList && userBooks)  {
                const combinedDatagenerated = 
                userFineList[0].map((fineListItem) => ({
                    ...fineListItem,
                    books: fineListItem.booksBorrowed.map((book) => ({
                        ...book,
                        bookImage: userBooks[0].find(b => b.id === book.book_id)?.image || '',
                        bookName: userBooks[0].find(b => b.id === book.book_id)?.title || ''}))
                    }))
                    setCombinedData(combinedDatagenerated)
            }
        }
        generateCombinedData()
    }
    , [userFineList, userBooks]
    )

    return(
        <div>
            <h2 className="fine-table-header">User Fine</h2>
            <table className="fine-table">
                <thead>
                    <tr>
                        <th>Book Image</th>
                        <th>Book Name</th>
                        <th>Return Date</th>
                        <th>Actual Return Date</th>
                        <th>Fine Paid</th>
                        <th colSpan="9">Fine</th>
                    </tr>
                    </thead>
                        <tbody>
                            {
                               combinedData ? 
                               ( combinedData.map((fineListItem) => (
                                        fineListItem.booksBorrowed.map((book) => 
                                            book.fineToPay > 0 ? (
                                                <tr key = {`${book.id}`}>
                                                    <td><img src = {book.bookImage} alt = {`${book.bookName} cover`}/></td>
                                                    <td>{book.bookName}</td>
                                                    <td>{book.returnDate}</td>
                                                    <td>{book.actualReturnDate}</td>
                                                    <td>{book.finePaid === Boolean(true)? "Yes":"No"}</td>
                                                    <td colSpan="9">{book.fineToPay}</td>
                                                </tr>
                                                ) : null
                                            )
                               ))) :
                                (
                                <tr>
                                    <td colSpan="8">Loading...</td>
                                </tr>
                                )
                            }
                            {
                                combinedData && (
                                                combinedData
                                                .flatMap((activityItem) => activityItem.books)
                                                .reduce((totalFine, book) => totalFine + (book.fineToPay || 0),0) > 0 ? (
                                                    <tr>
                                                        <td id="fine-table-total-fine" colSpan="8">
                                                            Total Fine
                                                        </td>
                                                        <td>
                                                        {combinedData
                                                            .flatMap((activityItem) => activityItem.books)
                                                            .reduce((totalFine, book) => totalFine + (book.fineToPay || 0), 0)}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8">No Fines due</td>
                                                    </tr>
                                                )
                                )}                  
                        </tbody>  
            </table>
        </div>
    )
}

export default CheckUserFinePage;