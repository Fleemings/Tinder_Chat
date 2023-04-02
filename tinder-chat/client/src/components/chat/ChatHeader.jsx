/* eslint-disable no-unused-vars */
import React from 'react';
import './ChatHeader.css';
import { useCookies } from 'react-cookie';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ user }) => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);

  let navigate = useNavigate();
  const handleLogout = () => {
    removeCookies('UserId', cookies.UserId);
    removeCookies('AuthToken', cookies.AuthToken);
    navigate('/');
  };
  return (
    <div className='chat_header__container'>
      <div className='chat_header-profile-pic'>
        <div className='image__container'>
          <img src={user.url} alt={'photo of' + user.first_name} />
        </div>
        <h3>{user.first_name}</h3>
      </div>
      <i className='log-out-icon' onClick={handleLogout}>
        <IoClose />
      </i>
    </div>
  );
};

export default ChatHeader;
