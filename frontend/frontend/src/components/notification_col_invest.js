import React, { useState } from 'react';
import '../styles/Notifications.css';
import { post } from '@/utils/api';

const NotificationColInvest = (props) => {
  const [message, setMessage] = useState('Añadir al proyecto');


  const handleAddInvestor = async () => {
    const token = localStorage.getItem('token');
    const body = {
      projectId: props.project_id,
      type: props.type,
      userId: props.id,
    };

    try {
      await post('/notification/addUser', body, { 'Authorization': `Bearer ${token}` });
      setMessage('Añadido al proyecto')

    } catch (error) {
      console.error("Error al crear la notificación:", error);
    }

  };

  return (
    <div className="notification-container">
      <div className="request-content">
        <h4>{props.name}</h4>
        <p>{props.type === 'investment_request' ? 'Quiere invertir en' : 'Quiere colaborar en'} {props.project_name}</p>
        <div className="buttons-notifications">
          <button className="btn-connect">Conectar</button>
          <button className="btn-message">Enviar Mensaje</button>
          <button className="btn-acceptance" onClick={handleAddInvestor}>{message}</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationColInvest;
