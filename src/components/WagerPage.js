import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BetsContext } from '../App';

export default function WagerPage() {
  const { betId } = useParams();
  const navigate  = useNavigate();
  const { bets, setBets } = useContext(BetsContext);

  // Find the bet the user just created in GamePage
  const bet = bets.find((b) => b.id.toString() === betId);
  const [amount, setAmount] = useState('');

  if (!bet) return <p className="p-4">Bet not found.</p>;

  function accept() {
    // Update this bet: set amount & mark accepted
    const updated = bets.map((b) => {
      if (b.id !== bet.id) return b;
      return {
        ...b,
        amount: parseFloat(amount),
        status: 'accepted',
      };
    });

    setBets(updated);
    navigate('/my-bets');
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Set Your Wager</h2>
      <p className="mb-2">
        You picked{' '}
        <strong>
          {bet.picks.userA === 'A'
            ? bet.game.teams.home.name
            : bet.game.teams.away.name}
        </strong>
      </p>
      <div className="mb-4">
        <input
          type="number"
          placeholder="Wager amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={accept}
          disabled={!amount || isNaN(amount)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Send to Friend
        </button>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600"
      >
        ◀ Back
      </button>
    </div>
  );
}