import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/Notifications.css';
import Navbar from '../components/navbar';
import NotificationConnect from '@/components/notification_connect';
import NotificationColInvest from '@/components/notification_col_invest';
import NotificationRequest from '@/components/notification_request';
import { get } from '@/utils/api';
import NotificationRequestConn from '@/components/notification_request_connection';


function Notifications() {
  const [selectedMenu, setSelectedMenu] = useState('Notificaciones');
  const router = useRouter();
  const [request, setRequest] = useState([]);
  const [received, setReceived] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }

    async function fetchRequest() {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await get(`/notification/received`, headers);
      setRequest(response);

    }

    async function fetchReceived() {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await get(`/notification/sent`, headers);
      setReceived(response);

    }

    fetchRequest();
    fetchReceived();


  }, [router]);



  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  }

  return (
    <>
      <Navbar notification={true} />
      <div className="background"></div>
      <div className="initial-container">
        <div className="notification-dashboard-content">
          <div className="row-menu-notifications">
            <div className={`menu-option ${selectedMenu === 'Notificaciones' ? 'active' : ''}`} onClick={() => handleMenuSelection('Notificaciones')}>
              Notificaciones
            </div>
            <div className={`menu-option ${selectedMenu === 'Solicitado' ? 'active' : ''}`} onClick={() => handleMenuSelection('Solicitado')}>
              Solicitado
            </div>
          </div>
          <div className="notification-content">
            {selectedMenu === 'Notificaciones' && (
              <>
                {received?.map((notification, index) => (
                  <>
                    <React.Fragment key={index}>
                      <NotificationColInvest name={notification.from_user.name}
                        project_name={notification.project_name}
                        type={notification.type}
                        id={notification.from_user.id}
                        project_id={notification.project_id}
                        key={notification.from_user.id} />

                    </React.Fragment>

                  </>

                ))}
              </>

            )}
            {selectedMenu === 'Solicitado' && (
              <>
                {request?.map((notification, index) => (
                  <>
                    <React.Fragment key={index}>
                      {notification.type === 'connection_request' ? (
                        <NotificationRequestConn name={notification.from_user.name} />
                      ) : (
                        <NotificationRequest name={notification.from_user.name}
                          project_name={notification.project_name}
                          type={notification.type}
                          status={notification.status} />
                      )}
                    </React.Fragment>

                  </>

                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Notifications;