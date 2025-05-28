import React, { useEffect, useState } from 'react';
import { Link }              from 'react-router-dom';
import { fetchLeagues }      from '../utils/api';
import '../index.css';       // or './Home.css' if you put it there

export default function Home() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetchLeagues().then(setLeagues);
  }, []);

  return (
    <div className="home-grid">
      {leagues.map((l) => (
        <Link key={l.key} to={`/sport/${l.key}`}>
          <img
            src={l.icon}
            alt={l.name}
            className="sport-icon"
          />
          <p className="sport-name">{l.name}</p>
        </Link>
      ))}
    </div>
  );
}