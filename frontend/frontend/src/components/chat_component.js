import React, { useState } from 'react';
import { useRouter } from 'next/router';
import '../styles/Chat.css';

const ComponentChat = (props) => {
    const router = useRouter();
    const [messageUnread, setMessageUnread] = useState(props.messages_unread);


    return (
        <button className="chat-card" onClick={() => router.push(`/messages?chatId=${props.id}&name=${props.name}`)}>
            <div className="chat-info">
                <div className='chat-row'>
                    <div className="profile-picture"></div>

                    <div className='chat-column'>
                        <div className="chat-name">{props.name}</div>
                        <div className="chat-last-message">{props.last_user}: {props.message}</div>
                    </div>
                </div>

                {messageUnread !== 0 && (
                    <div className='chat-unread'>
                        <p className='chat-unread-message'>{messageUnread}</p>
                    </div>
                )}
            </div>
        </button>
    );
};

export default ComponentChat;
