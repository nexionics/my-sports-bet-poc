import React, { useContext } from 'react';
import { BetsContext } from '../App';

export default function MyBets() {
  const { bets } = useContext(BetsContext);

  const containerStyle = {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px'
  };

  const orbStyle = {
    position: 'relative',
    width: '128px',
    height: '128px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '4px solid white',
    margin: '10px'
  };

  const teamStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px'
  };

  const amountStyle = {
    fontSize: '20px',
    fontWeight: 'bold'
  };

  const friendStyle = {
    fontSize: '12px',
    marginTop: '4px',
    opacity: '0.9'
  };

  const badgeStyle = {
    position: 'absolute',
    bottom: '-8px',
    right: '-8px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    border: '2px solid white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const ringStyle = {
    position: 'absolute',
    inset: '0',
    borderRadius: '50%',
    border: '2px solid white',
    opacity: '0.3'
  };

  return (
    <div style={containerStyle}>
      {bets.filter(b => b.status === 'accepted').map((b) => (
        <div key={b.id} style={orbStyle}>
          <div style={teamStyle}>{b.game.teams.home.abbr} vs {b.game.teams.away.abbr}</div>
          <div style={amountStyle}>${b.amount}</div>
          <div style={friendStyle}>with {b.emails.userB}</div>
          
          {/* Snapchat-like badge */}
          <div style={badgeStyle}>
            ${b.amount}
          </div>
          
          {/* Decorative ring */}
          <div style={ringStyle}></div>
        </div>
      ))}
    </div>
  );
}