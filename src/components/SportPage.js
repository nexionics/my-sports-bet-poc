import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUpcomingGames } from '../utils/api';

const leagueMap = { nba: 1, mlb: 2, wnba: 3 };

export default function SportPage() {
  const { key } = useParams();
  const [games, setGames] = useState([]);         // 1) default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetchUpcomingGames(leagueMap[key] || 1)
      .then((resp) => {
        // ensure we always end up with an array
        setGames(Array.isArray(resp) ? resp : []);
      })
      .catch((e) => {
        console.error('Fetch error:', e);
        setError(true);
        setGames([]);   // fallback to empty
      })
      .finally(() => {
        setLoading(false);
      });
  }, [key]);

  if (loading) return <p className="p-4">Loading {key.toUpperCase()} games…</p>;
  if (error)   return <p className="p-4 text-red-600">Error loading games.</p>;
  if (!games.length) return <p className="p-4">No upcoming {key.toUpperCase()} games found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{key.toUpperCase()} Upcoming Games</h1>
      <ul>
        {games.map((g) => (
          <li key={g.id} className="mb-2">
            <Link to={`/game/${g.id}`}>
              {g.teams.home.name} vs {g.teams.away.name} —{' '}
              {new Date(g.date).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
