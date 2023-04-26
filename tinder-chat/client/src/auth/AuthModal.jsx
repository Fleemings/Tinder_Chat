/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './AuthModal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { IoClose } from 'react-icons/io5';
import { BACK_SERVER_URL } from '../config/index';

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['user']); // null

  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('entrando');
    try {
      if (isSignUp && password !== confirmPassword) {
        setError('Passwords needs to match!');
        return;
      }
      console.log('confirmou 1');

      const response = await axios.post(
        `${BACK_SERVER_URL}/${isSignUp ? 'signup' : 'login'}`,
        { email, password }
      );
      console.log('acessou a rota');

      setCookies('AuthToken', response.data.token);
      setCookies('UserId', response.data.userId);

      const success = response.status === 201;
      console.log('entrando');
      if (success && isSignUp) navigate('/onboarding');
      if (success && !isSignUp) navigate('/dashboard');

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='auth__modal'>
      <div className='close__icon' onClick={handleClick}>
        <IoClose />
      </div>
      <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
      <p>
        By clicking sing up, you agree to our terms. Learn how we
        process your data in our <strong>Privacy Policy</strong> and{' '}
        <strong>Cookies Policy</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Email'
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type='password'
            id='confirm-password'
            name='confirm-password'
            placeholder='Confirm Password'
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input
          className='secondary__button'
          type='submit'
          value={`${isSignUp} ? 'SIGN UP' : 'LOGIN'`}
        />
        <p className='auth-model__error'>{error}</p>
      </form>
      <hr />
      <h2>GET THE APP</h2>
    </div>
  );
};

export default AuthModal;
