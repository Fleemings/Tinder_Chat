import React, { useState } from 'react';
import './ChatInput.css';
import { Axios } from '../../config/index';

const ChatInput = ({
  user,
  clickedUser,
  getMessages,
  getClickedUsersMessages,
}) => {
  const [textArea, setTextArea] = useState('');
  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      to_userId: clickedUserId,
      message: textArea,
    };

    try {
      await Axios.post('/api/message', { message });
      getMessages();
      getClickedUsersMessages();
      setTextArea('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='chat-input__container'>
      <textarea
        name='chat_input'
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
      ></textarea>
      <button className='secondary__button' onClick={addMessage}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
