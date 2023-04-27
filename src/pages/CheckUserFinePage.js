import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './CheckUserFinePage.css'
import TopNav from '../components/TopNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const CheckUserFinePage = () => {
    const { user_id } = useParams()
    const [userFineList, setUserFineList] = useState(null)
    const [userBooks, setUserBooks] = useState(null)
    const [combinedData, setCombinedData] = useState(null)

    useEffect(() => {
        async function fetchDetails() {
            try {
            // user_id is being passed as a query parameter here
            const userFineResponse = await fetch(`http://localhost:3000/getfinedetails/${user_id}`)
            const userFineData = await userFineResponse.json();
            const userFineDataArr = [userFineData]
            setUserFineList(userFineDataArr);

            const bookResponse = await fetch("http://localhost:3000/books");
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

                const combinedDataGenerated = 
                userFineList[0].map((activityListItem) => ({
                    ...activityListItem,
                    bookImage: userBooks[0].find(b => b.id === activityListItem.booksBorrowed.book_id)? userBooks[0].find(b => b.id === activityListItem.booksBorrowed.book_id).image : '',
                        bookName: userBooks[0].find(b => b.id === activityListItem.booksBorrowed.book_id)? userBooks[0].find(b => b.id === activityListItem.booksBorrowed.book_id).title : ''
                    
                    })
                    )

                    const combinedDataModified = 
                    combinedDataGenerated.flatMap(activityListItem =>activityListItem.booksBorrowed
                            .filter(book => book.fineToPay > 0)
                            .map(book => ({
                            ...book,
                            userId: activityListItem.user_id,
                            bookImage: userBooks[0].find(b => b.id === book.book_id)?.image || '',
                            bookName: userBooks[0].find(b => b.id === book.book_id)?.title || ''})
                            )
                        )
                        setCombinedData(combinedDataModified)
            }
        }
        generateCombinedData()
        console.log(combinedData)
    }
    , [userFineList, userBooks]
    )

    return(
        <div>
            <TopNav />
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
                                !combinedData ?  (<tr>
                                    <td colSpan="7">Loading...</td>
                                </tr>) : combinedData.length > 0 ?
                                ( combinedData.length > 0 && combinedData.map((activityListItem) => (

                                        <tr key = {activityListItem.book_id}>

                                            <td><img src = {activityListItem.bookImage} alt = {`${activityListItem.bookName} cover`}/></td>
                                            
                                            <td>{activityListItem.bookName}</td>

                                            <td>{new Date(activityListItem.returnDate).toLocaleDateString()}</td>

                                            <td>{new Date(activityListItem.actualReturnDate).toLocaleDateString()}</td>

                                            <td className="green-check-red-cross">{activityListItem.finePaid ? <FontAwesomeIcon icon={faCheck} className="fa-check"/> : <FontAwesomeIcon icon={faTimes} />}</td>
                                            
                                            <td colSpan="8">{activityListItem.fineToPay}</td>
                                        </tr>
                                    )
                                )) : (
                                    <tr>
                                        <td colSpan="8">No fine due</td>
                                    </tr>
                                    )}
                                    {
                                        combinedData !== null && combinedData.length !== 0 && (
                                            <tr>
                                                <td id="fine-table-total-fine" colSpan="8">Total Fine Due</td>
                                                <td id="fine-table-total-fine-number">
                                                    {
                                                        combinedData.reduce((totalfine, activityItem) => {
                                                            if (activityItem.finePaid === false) {
                                                            return totalfine + (activityItem.fineToPay || 0);
                                                            } else {
                                                            return totalfine;
                                                            }
                                                        }, 0)
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }
                        </tbody>  
            </table>
        </div>
    )
}

export default CheckUserFinePage;