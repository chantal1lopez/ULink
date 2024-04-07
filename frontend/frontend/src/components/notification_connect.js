import React from 'react';
import '../styles/Notifications.css';

const NotificationConnect = (props) => {
  return (
    <div className="notification-container">
      <div className="notification-name">{props.name}</div>
      <div className="notification-action">
        Quiere conectar contigo
      </div>
      <button className="notification-btn accept">Aceptar</button>
      <button className="notification-btn reject">Rechazar</button>
    </div>
  );
};

export default NotificationConnect;
