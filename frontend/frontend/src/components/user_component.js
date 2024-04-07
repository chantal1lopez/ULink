import React, { useState } from 'react';
import { useRouter } from 'next/router';

import '../styles/Network.css';
import { post } from '@/utils/api';

const ComponentUser = (props) => {
  const router = useRouter();

  const handleSendMessageClick = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    console.log(props.id);

    const body = {
      participantId: props.id,
    }

    const response = await post(`/chat`, body, headers);

    router.push(`/messages?chatId=${response.chatId}&name=${response.name}`)

  };

  return (
    <button className="user-card" onClick={() => router.push(`/user?id=${props.id}`)}>
      <div className="profile-picture"></div>
      <div className="user-info">
        <div className="user-name">{props.name}</div>
        <div className="user-location">{props.location}</div>
        <button className="more-info-btn" onClick={handleSendMessageClick} >
          Enviar mensaje
        </button>

      </div>
    </button>
  );
};

export default ComponentUser;
