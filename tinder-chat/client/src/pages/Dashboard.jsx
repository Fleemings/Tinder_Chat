/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import './css/Dashboard.css';
import ChatContainer from '../components/chat/ChatContainer';
import { Axios } from '../config/index';
import { useCookies } from 'react-cookie';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await Axios.get('/api/user', {
        params: { userId },
      });

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      const response = await Axios.get('/api/gendered-users', {
        params: {
          gender: user?.gender_interest,
        },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>loading..</div>;
  }

  const updateMatches = async (matchedUserId) => {
    try {
      await Axios.put('/api/addmatch', {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  // set last direction and decrease current index
  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(`${name} left the screen!`);
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteresGenderedUsers = genderedUsers?.filter(
    (genderedUsers) => !matchedUserIds.includes(genderedUsers.user_id)
  );

  return (
    <>
      {user && (
        <div className='dashboard'>
          <ChatContainer user={user} />
          <div className='swiper__container'>
            <div className='card__container'>
              {filteresGenderedUsers?.map((genderedUser) => (
                <TinderCard
                  className='swipe'
                  key={genderedUser.user_id}
                  onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                  onCardLeftScreen={() =>
                    outOfFrame(genderedUser.first_name)
                  }
                >
                  <div
                    style={{
                      backgroundImage:
                        'url(' + genderedUser.url + ')',
                    }}
                    className='card'
                  >
                    <h3>{genderedUser.first_name}</h3>
                  </div>
                </TinderCard>
              ))}
            </div>
            {lastDirection ? (
              <h2 key={lastDirection} className='infoText'>
                You swiped {lastDirection}
              </h2>
            ) : (
              <h2 className='infoText'>
                Swipe a card to get a match
              </h2>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
