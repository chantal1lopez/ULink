import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';
import { useRouter } from 'next/router';

import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addChatNotification, addNotification, clearChatNotifications, clearNotifications } from '../../store/notificationReducer';


const Navbar = ({ notification = false, chat = false }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const hasNotification = useSelector((state) => state.notification.hasNotification);
  const hasChatNotification = useSelector((state) => state.notification.hasChatNotification);



  const dropdownRef = useRef(null);
  const notificationSound = typeof Audio !== "undefined" ? new Audio('/sounds/notification_sound.mp3') : null;



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
      dispatch(addChatNotification());
      notificationSound.play().catch(error => console.error('Error al reproducir el sonido de la notificación:', error));
    });

    socket.on('notification', (m) => {
      dispatch(addNotification());
      notificationSound.play().catch(error => console.error('Error al reproducir el sonido de la notificación:', error));

    });

    if (notification && hasNotification) {
      dispatch(clearNotifications());
    }

    console.log(chat, hasChatNotification)
    if (chat && hasChatNotification) {
      dispatch(clearChatNotifications());
      console.log(hasChatNotification)
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/home">
          <Image src="/images/simbolo.png" alt="Logo" width={50} height={50} />
        </Link>
      </div>
      <div className={styles.menu}>
        <div className={styles.menu_buttons}>
          <Link href="/dashboard">
            <Image src="/images/Launch.png" alt="Home" width={30} height={30} />
          </Link>
          <Link href="/network">

            <Image src="/images/Users.png" alt="Networking" width={30} height={30} />

          </Link>
          <Link href="/notifications">

            <Image src="/images/Letter.png" alt="Notifications" width={30} height={30} />
            {hasNotification && <span className={styles.notificationDot}></span>}


          </Link>
          <Link href="/chats">

            <Image src="/images/Chat.png" alt="Chats" width={30} height={30} />
            {hasChatNotification && <span className={styles.notificationDot}></span>}


          </Link>
          <Link href="/profile">

            <Image src="/images/Customer.png" alt="User Profile" width={30} height={30} />

          </Link>
        </div>
      </div>
      <div className={styles.setting_container} onClick={toggleDropdown} ref={dropdownRef}>
        <Image src="/images/Settings.png" alt="Ajustes" width={30} height={30} />
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <div>
              <button onClick={() => { router.push('/editProfile'); }}>Editar Perfil</button>
            </div>
            <div>
              <button onClick={() => { router.push('/saved'); }}>Guardado</button>
            </div>
            <div>
              <button onClick={handleLogoutClick}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
