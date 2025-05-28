import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BetsContext } from '../App';
import { fetchUpcomingGames } from '../utils/api';

const leagueMap = { nba: 1, mlb: 2, wnba: 3 };

export default function GamePage() {
  const { gameId } = useParams();
  const navigate    = useNavigate();
  const { bets, setBets } = useContext(BetsContext);

  const [game, setGame]         = useState(null);
  const [userPick, setUserPick] = useState('A');
  const [inviteEmail, setInviteEmail] = useState('');

  // Load the selected game (search across all leagues in mock/dev mode)
  useEffect(() => {
    Promise.all(
      Object.values(leagueMap).map((id) => fetchUpcomingGames(id))
    )
      .then((lists) => lists.flat())
      .then((allGames) => {
        const found = allGames.find((g) => g.id.toString() === gameId);
        setGame(found || null);
      })
      .catch((err) => {
        console.error('Error fetching games:', err);
        setGame(null);
      });
  }, [gameId]);

  if (!game) return <p className="p-4">Loading game details…</p>;

  function invite() {
    // Opponent automatically picks the opposite team
    const opponentPick = userPick === 'A' ? 'B' : 'A';
    const newBet = {
      id: bets.length,        // simple incrementing id
      gameId: game.id,
      game,
      picks: { userA: userPick, userB: opponentPick },
      emails: { userA: 'you', userB: inviteEmail },
      amount: null,
      status: 'pending',      // will become 'accepted' in WagerPage
    };

    setBets([...bets, newBet]);
    navigate(`/wager/${newBet.id}`);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">
        {game.teams.home.name} vs {game.teams.away.name}
      </h2>

      <div className="mb-4">
        <button
          onClick={() => setUserPick('A')}
          className={`mr-2 px-4 py-2 rounded ${userPick === 'A' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pick {game.teams.home.name}
        </button>
        <button
          onClick={() => setUserPick('B')}
          className={`px-4 py-2 rounded ${userPick === 'B' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pick {game.teams.away.name}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Friend’s email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={invite}
          disabled={!inviteEmail}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Invite Friend
        </button>
      </div>
    </div>
  );
}