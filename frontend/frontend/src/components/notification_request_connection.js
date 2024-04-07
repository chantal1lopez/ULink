import React from 'react';
import '../styles/Notifications.css';

const NotificationRequestConn = (props) => {

  return (
    <div className="notification-container">
      <div className="notification-name">{props.name}</div>
      <div className="notification-action">
        Ha empezado a seguirte
      </div>

    </div>
  );
};

export default NotificationRequestConn;
