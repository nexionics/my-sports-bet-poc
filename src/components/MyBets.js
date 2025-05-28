import React, { useContext } from 'react';
import { BetsContext } from '../App';

export default function MyBets() {
  const { bets } = useContext(BetsContext);

  return (
    <div className="p-4 grid grid-cols-4 gap-4">
      {bets.map((b) => (
        <div key={b.id} className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
          <p>{b.game.teams.home.abbr} vs {b.game.teams.away.abbr}</p>
        </div>
      ))}
    </div>
  );
}