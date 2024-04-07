import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/Messages.css';
import Navbar from '../components/navbar';
import { get, post } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { fetchUserProfile } from '../../store/userSlice';


function Messages() {
    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const { chatId, name } = router.query; 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');

            const token = localStorage.getItem('token');

            if (token) {
                socket.emit('authenticate', { token });
            } else {
                console.log('No se encontró token de autenticación.');
            }
        });

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);

        });


        return () => {
            socket.off('connect');
            socket.off('newMessage');
            socket.close();
        };
    }, []);


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
            const response = await get(`/chat/messages/${chatId}`, headers);
            setMessages(response)

        }

        fetchChats()


    }, [router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        const response = await post('/chat/message', {
            chatId: chatId,
            text: newMessage,
        }, headers);


        if (response) {
            setMessages([...messages, response]);
            setNewMessage('');

        }
    };

    return (
        <>
            <Navbar />
            <div className="background"></div>
            <div className="initial-container-message">
                <div className="message-content">
                    <p className="title-messages">{name}</p>
                    <div className='messages-text' >
                        {messages && messages.map((msg, index) => (
                            <p key={index} className={`individual-message ${msg.sender_id === userInfo._id ? 'individual-message-own' : ''}`}>{msg.text}</p>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>


                    <form onSubmit={handleSendMessage} className="message-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                        />
                        <button type="submit">Enviar</button>
                    </form>
                </div>

            </div>
        </>
    );
}

export default Messages;