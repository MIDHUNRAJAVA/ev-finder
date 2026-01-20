import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const Admin = () => {
  const [bookings, setBookings] = useState([]);

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

  // Fetch data from the database
  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Update booking status
  const updateStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update status: ${response.statusText}`);
        }

        const updatedBooking = await response.json();
        setBookings((prevBookings) =>
            prevBookings.map((booking) =>
                booking._id === updatedBooking._id ? updatedBooking : booking
            )
        );
    } catch (error) {
        console.error('Error updating status:', error);
    }
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h1 className="title">eV-finder</h1>
        <input type="date" defaultValue="2024-10-08" />
        <div className="profile-icon">
          <i className="fas fa-user-circle"></i>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S.no</th>
              <th>User Name</th>
              <th>Time</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{sanitizeText(booking.name)}<br />({sanitizeText(booking.staffId)}) </td>
                <td>{sanitizeText(booking.date)}<br />{sanitizeText(booking.time)} </td>
                <td>{sanitizeText(booking.source)}</td>
                <td>{sanitizeText(booking.destination)}</td>
                <td>
                  {booking.status === 'Pending' ? (
                    <>
                      <FaCheckCircle
                        className="success-icon"
                        onClick={() => updateStatus(booking._id, 'Accepted')}
                      />
                      <FaTimesCircle
                        className="danger-icon"
                        onClick={() => updateStatus(booking._id, 'Declined')}
                      />
                    </>
                  ) : (
                    <span className={getStatusClassName(booking.status)}>
                      {sanitizeText(booking.status)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn">Previous</button>
        <span className="page-info">1-1 of 1</span>
        <button className="btn">Next</button>
      </div>
    </div>
  );
};

export default Admin;
