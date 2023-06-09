/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './MatchesDisplay.css';
import { BACK_SERVER_URL } from '../../config/index';
import axios from 'axios';

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchesProfile, setMatchesProfile] = useState(null);

  const matchedUserIds = matches.map(({ user_id }) => user_id);

  const getMatches = async () => {
    try {
      const response = await axios.get(`${BACK_SERVER_URL}/users`, {
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
