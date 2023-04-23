import { useState, useEffect } from 'react';
import "font-awesome/css/font-awesome.min.css";
import './NotificationBell.css';

function NotificationBell({userId}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/notifications/${userId}`)
      .then(response => response.json())
      .then(data => {
        setNotifications(data.notifications);
        const unreadNotifications = data.notifications.filter(notification => !notification.read);
        setUnreadCount(unreadNotifications.length);
      })
      .catch(error => console.error(error));
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setUnreadCount(0);
  };

  const markAsRead = async (notificationId) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });  

    const response = await fetch(`http://127.0.0.1:3000/notifications/${notificationId}`, {
        method: 'PUT',
      });

    setNotifications(updatedNotifications);
  };

  return (
    <div className="notification-bell">
      <i className="fa fa-bell" onClick={toggleDropdown}></i>
      {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
      {dropdownOpen && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => {
                  markAsRead(notification.id);
                  toggleDropdown();
                }}
              >
                <span className={`notification-dot ${notification.read ? '' : 'unread'}`}></span>
                <span className="notification-text">{notification.message}</span>
                {/* <span className="notification-time">{notification.timestamp}</span> */}

                {/* <div className="notification-text">{notification.message}</div> */}
                <div className="notification-time">{new Date(notification.timestamp).toLocaleString()}</div>

              </div>
            ))
          ) : (
            <div className="no-notifications">No notifications to show</div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;