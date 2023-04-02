/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import './css/Dashboard.css';
import ChatContainer from '../components/chat/ChatContainer';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [genderedUsers, setGenderedUsers] = useState(null);

  const [lastDirection, setLastDirection] = useState();

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user', {
        params: { userId },
      });

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/gendered-users',
        {
          params: {
            gender: user?.gender_interest,
          },
        }
      );
      setGenderedUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put('http://localhost:8080/addmatch', {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  console.log(user);

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

  console.log('filteredGenderedUsers ', filteresGenderedUsers);

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
