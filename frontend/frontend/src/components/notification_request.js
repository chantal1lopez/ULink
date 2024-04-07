import React from 'react';
import '../styles/Notifications.css';

const NotificationRequest = (props) => {
  const requestType = props.type === 'investment_request' ? 'inversión' : 'colaboración';

  const statusMessages = {
    pending: 'Pendiente',
    accepted: 'Aceptado',
    rejected: 'Rechazado'
  };

  const statusMessage = statusMessages[props.status] || 'Desconocido';

  return (
    <div className="notification-container">
      <div className="notification-name">{props.name}</div>
      <div className="notification-action">
        Solicitud de {requestType} en {props.project_name}
      </div>
      <div className="notification-status">
        Estado: {statusMessage}
      </div>
    </div>
  );
};

export default NotificationRequest;
