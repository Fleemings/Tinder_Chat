import React, { useState } from 'react';
import './ChatContainer.css';
import ChatDisplay from './ChatDisplay';
import ChatHeader from './ChatHeader';
import MatchesDisplay from './MatchesDisplay';

const ChatContainer = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);

  return (
    <>
      <div className='chat__container'>
        <ChatHeader user={user} />
        <div>
          <button
            className='chat__option'
            onClick={() => setClickedUser(null)}
          >
            Matches
          </button>
          <button className='chat__option' disabled={!clickedUser}>
            Chat
          </button>
        </div>

        {!clickedUser && (
          <MatchesDisplay
            matches={user.matches}
            setClickedUser={setClickedUser}
          />
        )}
        {clickedUser && (
          <ChatDisplay user={user} clickedUser={clickedUser} />
        )}
      </div>
    </>
  );
};

export default ChatContainer;
