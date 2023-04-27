/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './AuthModal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { IoClose } from 'react-icons/io5';
import { BACK_SERVER_URL } from '../config/index';
import validator from 'validator';

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookies, removeCookies] = useCookies(['user']); // null

  let navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmPassword) {
        setError('Confirm Password should match with Password');
        return;
      }

      const response = await axios.post(
        `${BACK_SERVER_URL}/${isSignUp ? 'signup' : 'login'}`,
        { email, password }
      );

      setCookies('AuthToken', response.data.token);
      setCookies('UserId', response.data.userId);

      const success = response.status === 201;
      if (success && isSignUp) navigate('/onboarding');
      if (success && !isSignUp) navigate('/dashboard');

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const validate = (e) => {
    setPassword(e.target.value);
    if (
      validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage('strong password');
    } else {
      setErrorMessage(
        'Your password must have: 6 caracters, 1 Uppercase, 1 Lowercase, 1 Number, 2 Symbols'
      );
    }
  };

  const inputAuth = isSignUp ? 'SIGN UP' : 'LOGIN';

  return (
    <div className='auth__modal'>
      <div className='close__icon' onClick={handleClick}>
        <IoClose />
      </div>
      <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
      <p>
        {isSignUp
          ? 'By clicking sing up, you agree to our terms. Learn how we process your data in our Privacy Policy and Cookies Policy'
          : 'Please add your credentials to login and keep swipping for a perfect match'}
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
          onChange={validate}
          autoComplete='true'
        />
        {errorMessage === '' ? null : (
          <span className='auth-error-message'>{errorMessage}</span>
        )}
        {isSignUp && (
          <input
            type='password'
            id='confirm-password'
            name='confirm-password'
            placeholder='Confirm Password'
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete='true'
          />
        )}
        <input
          className='secondary__button'
          type='submit'
          value={inputAuth}
        />
        <p className='auth-model__error'>{error}</p>
      </form>
      <hr />
      <h2>GET THE APP</h2>
    </div>
  );
};

export default AuthModal;
