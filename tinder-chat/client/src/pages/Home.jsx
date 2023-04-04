/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Nav from '../components/navbar/Nav';
import AuthModal from '../auth/AuthModal';
import './css/Home.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookies, removeCookies] = useCookies(['user']);

  const authToken = cookies.AuthToken;
  let navigate = useNavigate();

  const handleClick = () => {
    if (authToken) {
      removeCookies('UserId', cookies.UserId);
      removeCookies('AuthToken', cookies.AuthToken);
      window.location.reload();
      return;
    }
    setShowModal(true);
    setIsSignUp(true);
  };

  const handleDahsboard = () => {
    if (authToken) {
      navigate('/dashboard');
    }
  };
  return (
    <div className='overlay'>
      <Nav
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
        authToken={authToken}
      />
      <div className='home'>
        <h1 className='home__primaty-title'>Swipe Right&#174;</h1>
        <button className='primary-button' onClick={handleClick}>
          {authToken ? 'Signout' : 'Create Account'}
        </button>
        {authToken && (
          <button
            className='primary-button'
            onClick={handleDahsboard}
          >
            DASHBOARD
          </button>
        )}
        {showModal && (
          <AuthModal
            setShowModal={setShowModal}
            isSignUp={isSignUp}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
