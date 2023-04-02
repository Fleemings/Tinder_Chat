import React from 'react';
import './Nav.css';
import WhiteLogo from '../../assets/images/letter-white.png';
import ColorLogo from '../../assets/images/color-letter.png';
import { useNavigate } from 'react-router-dom';

const Nav = ({
  minimal,
  setShowModal,
  showModal,
  setIsSignUp,
  authToken,
}) => {
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  let navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav>
      <div className='logo__container' onClick={handleLogoClick}>
        <img
          className='logo'
          src={minimal ? ColorLogo : WhiteLogo}
          alt='tinder logo'
        />
      </div>
      {!authToken && !minimal && (
        <button
          className='nav__button'
          onClick={handleClick}
          disabled={showModal}
        >
          Log in
        </button>
      )}
    </nav>
  );
};

export default Nav;
