/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import './ChatDisplay.css';
import ChatInput from './ChatInput';
import { Axios } from '../../config/index';

const ChatDisplay = ({ user, clickedUser }) => {
  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  const [usersMessages, setUsersMessages] = useState(null);
  const [clickedUserMessages, setClickedUserMessages] =
    useState(null);

  const getMessages = async () => {
    try {
      const response = await Axios.get('/api/messages', {
        params: {
          userId: userId,
          correspondingUserId: clickedUserId,
        },
      });
      setUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClickedUsersMessages = async () => {
    try {
      const response = await Axios.get('/api/messages', {
        params: {
          userId: clickedUserId,
          correspondingUserId: userId,
        },
      });
      setClickedUserMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMessages();
    getClickedUsersMessages();
  }, []);

  const messages = [];

  usersMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage['name'] = user?.first_name;
    formattedMessage['img'] = user?.url;
    formattedMessage['message'] = message.message;
    formattedMessage['timestamp'] = message.timestamp;
    messages.push(formattedMessage);
  });

  clickedUserMessages?.forEach((message) => {
    const formattedMessage = {};
    formattedMessage['name'] = clickedUser?.first_name;
    formattedMessage['img'] = clickedUser?.url;
    formattedMessage['message'] = message.message;
    formattedMessage['timestamp'] = message.timestamp;
    messages.push(formattedMessage);
  });

  const descendingOrderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  console.log('messages ' + messages);
  console.log('UserMessages ' + usersMessages);
  return (
    <>
      <Chat descendingOrderMessages={descendingOrderMessages} />
      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getMessages={getMessages}
        getClickedUsersMessages={getClickedUsersMessages}
      />
    </>
  );
};

export default ChatDisplay;
