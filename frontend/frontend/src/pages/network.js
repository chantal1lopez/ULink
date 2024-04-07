import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/Network.css';
import Navbar from '../components/navbar';
import ComponentUser from '@/components/user_component';
import { get } from '@/utils/api';

function Network() {
  const [selectedMenu, setSelectedMenu] = useState('Seguidores');
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }

    async function fetchFollowers() {
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await get(`/user/followers`, headers);
      setFollowers(response);

    }
    async function fetchFollowings() {


      const headers = {
        'Authorization': `Bearer ${token}`,
      };
      const response = await get(`/user/following`, headers);
      setFollowing(response);

    }

    fetchFollowers();
    fetchFollowings();
    console.log('followers, ', followers)
    console.log('following, ', following)


  }, [router]);

  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  }

  return (
    <>
      <Navbar />
      <div className="background"></div>
      <div className="initial-container">
        <div className="network-content">
          <div className="row-menu-network">
            <div className={`menu-option-network ${selectedMenu === 'Seguidores' ? 'active-follow' : ''}`} onClick={() => handleMenuSelection('Seguidores')}>
              Seguidores
            </div>
            <div className={`menu-option-network ${selectedMenu === 'Siguiendo' ? 'active-follow' : ''}`} onClick={() => handleMenuSelection('Siguiendo')}>
              Siguiendo
            </div>
          </div>
          <div className="follo-content">
            {selectedMenu === 'Seguidores' && (
              <>
                {followers?.map((user, index) => (
                  <>
                    <ComponentUser
                      key={index}
                      name={user.name}
                      location={`${user.location.city}, ${user.location.country}`}
                      id={user._id}
                    />

                  </>

                ))}
              </>

            )}
            {selectedMenu === 'Siguiendo' && (
              <>

                {following?.map((user, index) => (
                  <>
                    <ComponentUser
                      key={user._id}
                      name={user.name}
                      location={`${user.location.city}, ${user.location.country}`}
                      id={user._id}
                    />

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

export default Network;