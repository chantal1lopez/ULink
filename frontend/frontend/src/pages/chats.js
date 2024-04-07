import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/Chat.css';
import Navbar from '../components/navbar';
import ComponentChat from '@/components/chat_component';
import { get } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../store/userSlice';

function Chats() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [chats, setChats] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }

    if (userInfo === null) {
      dispatch(fetchUserProfile());
    }

    async function fetchChats() {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await get(`/chat`, headers);
      setChats(response);
      console.log(response);

    }

    fetchChats()


  }, [router]);

  return (
    <>
      <Navbar chat={true} />
      <div className="background"></div>
      <div className="initial-container-chat">
        <div className="chat-content">
          {chats?.map((chat, index) => {
            return (
              <ComponentChat
                id={chat?._id}
                key={index}
                name={chat?.receiver?.name}
                message={chat?.last_message}
                last_user={chat?.last_message_sender}
                messages_unread={chat?.unread_messages}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Chats;