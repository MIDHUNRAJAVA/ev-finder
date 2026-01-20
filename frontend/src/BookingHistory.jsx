import React, { useContext } from 'react';
import './BookingHistory.css';
import { BookingContext } from './context/BookingContext';
import Navbar from './Navbar';
import DOMPurify from 'dompurify';

const BookingHistory = () => {
    const { bookings } = useContext(BookingContext);

    // Helper function to sanitize text content
    const sanitizeText = (text) => {
        if (!text) return '';
        return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
    };

    // Helper function to get safe status class name
    const getStatusClassName = (status) => {
        const validStatuses = ['pending', 'accepted', 'declined'];
        const sanitizedStatus = status ? status.toLowerCase().trim() : '';
        return validStatuses.includes(sanitizedStatus) ? sanitizedStatus : 'pending';
    };

    return (
        <>
        <div className='book-container'>
        <Navbar/>
        <div className="booking-container">
            <h2 className="title">Booking History</h2>
            <table>
                <thead>
                    <tr>
                        <th>S.no</th>
                        <th>User Name</th>
                        <th>Date & Time</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={booking._id}>
                            <td>{index + 1}</td>
                            <td>{sanitizeText(booking.name)}<br />({sanitizeText(booking.staffId)})</td>
                            <td>{sanitizeText(booking.date)} <br />{sanitizeText(booking.time)}</td>
                            <td>{sanitizeText(booking.source)}</td>
                            <td>{sanitizeText(booking.destination)}</td>
                            <td>{sanitizeText(booking.reason)}</td>
                            <td>
                                <span className={getStatusClassName(booking.status)}>{sanitizeText(booking.status)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
        </>
    );
};

export default BookingHistory;
