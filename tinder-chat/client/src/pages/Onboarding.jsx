/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './css/Onboarding.css';
import Nav from '../components/navbar/Nav';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
  const [cookies, setCookies, removeCookies] = useCookies(['user']);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: '',
    dob_day: '',
    dob_month: '',
    dob_year: '',
    show_gender: false,
    gender_identity: 'woman',
    gender_interest: 'woman',
    url: '',
    about: '',
    matches: [],
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:8080/user', {
        formData,
      });
      const sucess = response.status === 200;

      if (sucess) navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />

      <div className='onboarding'>
        <h2>CREATE ACCOUNT</h2>

        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor='first_name'>First Name</label>
            <input
              type='text'
              name='first_name'
              id='first_name'
              placeholder='First Name'
              required={true}
              value={formData.first_name}
              onChange={handleChange}
            />
            <label>Birthday</label>
            <div className='multiple-input__container'>
              <input
                type='number'
                name='dob_day'
                id='dob_day'
                placeholder='DD'
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                type='number'
                name='dob_month'
                id='dob_month'
                placeholder='MM'
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                type='number'
                name='dob_year'
                id='dob_year'
                placeholder='YYYY'
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>
            <label>Gender</label>
            <div className='multiple-input__container'>
              <input
                type='radio'
                name='gender_identity'
                id='man-gender-identity'
                value='man'
                onChange={handleChange}
                checked={formData.gender_identity === 'man'}
              />
              <label htmlFor='man-gender-identity'>Man</label>
              <input
                type='radio'
                name='gender_identity'
                id='woman-gender-identity'
                value='woman'
                onChange={handleChange}
                checked={formData.gender_identity === 'woman'}
              />
              <label htmlFor='woman-gender-identity'>Woman</label>
              <input
                type='radio'
                name='gender_identity'
                id='non-binary-gender-identity'
                value='non-binary'
                onChange={handleChange}
                checked={formData.gender_identity === 'non-binary'}
              />
              <label htmlFor='non-binary-gender-identity'>
                Non binary
              </label>
              <input
                type='radio'
                name='gender_identity'
                id='other-gender-identity'
                value='other'
                onChange={handleChange}
                checked={formData.gender_identity === 'other'}
              />
              <label htmlFor='other-gender-identity'>Other</label>
            </div>
            <label htmlFor='show-gender'>Show my gender</label>
            <input
              type='checkbox'
              name='show_gender'
              id='show-gender'
              onChange={handleChange}
              checked={formData.show_gender}
            />

            <label htmlFor='show-me'>Show me</label>
            <div className='multiple-input__container'>
              <input
                type='radio'
                name='gender_interest'
                id='man-gender-interest'
                value='man'
                onChange={handleChange}
                checked={formData.gender_interest === 'man'}
              />
              <label htmlFor='man-gender-interest'>Man</label>
              <input
                type='radio'
                name='gender_interest'
                id='woman-gender-interest'
                value='woman'
                onChange={handleChange}
                checked={formData.gender_interest === 'woman'}
              />
              <label htmlFor='woman-gender-interest'>Woman</label>
              <input
                type='radio'
                name='gender_interest'
                id='everyone-gender-interest'
                value='everyone'
                onChange={handleChange}
                checked={formData.gender_interest === 'everyone'}
              />
              <label htmlFor='everyone-gender-interest'>
                Everyone
              </label>
            </div>
            <label htmlFor='about'>About me</label>
            <input
              type='text'
              id='about'
              name='about'
              required={true}
              placeholder='I like to party with my friends'
              value={formData.about}
              onChange={handleChange}
            />
            <input type='submit' />
          </section>
          <section className='profile-section__container'>
            <label htmlFor='url'>Profile Photo</label>
            <input
              type='url'
              name='url'
              id='url'
              onChange={handleChange}
              required={true}
            />
            <div className='photo__container'>
              {formData.url && (
                <img src={formData.url} alt='profile pic' />
              )}
            </div>
          </section>
        </form>
      </div>
    </>
  );
};

export default Onboarding;
