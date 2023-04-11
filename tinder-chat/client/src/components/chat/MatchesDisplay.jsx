/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './MatchesDisplay.css';
import { Axios } from '../../config/index';
import { useCookies } from 'react-cookie';

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchesProfile, setMatchesProfile] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['user']); // null

  const matchedUserIds = matches.map(({ user_id }) => user_id);

  const getMatches = async () => {
    try {
      const response = await Axios.get('/api/users', {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });

      setMatchesProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  return (
    <div className='matches-display__container'>
      {matchesProfile?.map((match) => (
        <div
          key={match.user_id}
          className='match-card__container'
          onClick={() => setClickedUser(match)}
        >
          <div className='img__container'>
            <img
              src={match?.url}
              alt={match?.first_name + ' profile'}
            />
          </div>
          <h3>{match?.first_name}</h3>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
