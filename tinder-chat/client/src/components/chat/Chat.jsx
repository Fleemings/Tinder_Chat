import React from 'react';
import './ChatDisplay.css';

const Chat = ({ descendingOrderMessages }) => {
  return (
    <div className='chat-display__container'>
      {descendingOrderMessages.map((message, _index) => (
        <div key={_index}>
          <div className='chat-message__header'>
            <div className='image__container'>
              <img
                src={message.img}
                alt={message.first_name + 'profile'}
              />
            </div>
            <p> {message.name}: </p>
            <p> {message.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
