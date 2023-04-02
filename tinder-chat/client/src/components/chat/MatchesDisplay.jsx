/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './MatchesDisplay.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchesProfile, setMatchesProfile] = useState(null);
  const [cookies, setCookies, removeCookies] = useCookies(['user']); // null

  const matchedUserIds = matches.map(({ user_id }) => user_id);

  const userId = cookies.UserId;

  const getMatches = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/users',
        {
          params: { userIds: JSON.stringify(matchedUserIds) },
        }
      );

      setMatchesProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  const filteredMatchedProfile = matchesProfile?.filter(
    (matchProfile) =>
      matchProfile.matches.filter(
        (profile) => profile.user_id === userId
      ).length > 0
  );

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
