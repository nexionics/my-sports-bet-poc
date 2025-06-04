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
  const [friendEmail, setFriendEmail] = useState(bet ? bet.emails.userB : '');

  const containerStyle = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const gameOrbStyle = {
    position: 'relative',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '4px solid white',
    padding: '16px',
    marginBottom: '32px',
    textAlign: 'center'
  };

  const ringStyle = {
    position: 'absolute',
    inset: '0',
    borderRadius: '50%',
    border: '2px solid white',
    opacity: '0.3'
  };

  const teamStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const pickStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: '8px'
  };

  const formGroupStyle = {
    width: '100%',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '16px',
    marginBottom: '8px'
  };

  const quickBetsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '16px',
    marginBottom: '24px'
  };

  const quickBetOrbStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '2px solid white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  };

  const backButtonStyle = {
    marginTop: '16px',
    color: '#6b7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  };

  if (!bet) return <p style={{ padding: '16px' }}>Bet not found.</p>;

  function setQuickBet(value) {
    setAmount(value.toString());
  }

  function accept() {
    // Update this bet: set amount & mark accepted
    const updated = bets.map((b) => {
      if (b.id !== bet.id) return b;
      return {
        ...b,
        amount: parseFloat(amount),
        emails: { ...b.emails, userB: friendEmail },
        status: 'accepted',
      };
    });

    setBets(updated);
    navigate('/my-bets');
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Set Your Wager</h2>
      
      {/* Game Orb */}
      <div style={gameOrbStyle}>
        <div style={teamStyle}>{bet.game.teams.home.name} vs {bet.game.teams.away.name}</div>
        <div style={{ fontSize: '14px', opacity: '0.9' }}>{new Date(bet.game.date).toLocaleDateString()}</div>
        <div style={pickStyle}>You picked: {bet.picks.userA === 'A'
            ? bet.game.teams.home.name
            : bet.game.teams.away.name}
        </div>
        <div style={ringStyle}></div>
      </div>
      
      {/* Proposer */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Proposer:</label>
        <input 
          type="text" 
          value="admin@legacybet.com" 
          readOnly 
          style={inputStyle} 
        />
      </div>
      
      {/* Friend Email */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Invite Friend:</label>
        <input 
          type="email" 
          placeholder="Friend's email or ID" 
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          style={inputStyle} 
        />
      </div>
      
      {/* Wager Amount */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Wager Amount:</label>
        <input 
          type="number" 
          placeholder="Enter amount" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle} 
        />
        
        {/* Quick Bet Options */}
        <div style={quickBetsContainerStyle}>
          <div 
            style={quickBetOrbStyle}
            onClick={() => setQuickBet(20)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 10px -2px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            $20
          </div>
          <div 
            style={quickBetOrbStyle}
            onClick={() => setQuickBet(50)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 10px -2px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            $50
          </div>
          <div 
            style={quickBetOrbStyle}
            onClick={() => setQuickBet(100)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 10px -2px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            $100
          </div>
        </div>
      </div>
      
      {/* Confirm Button */}
      <button
        onClick={accept}
        disabled={!amount || isNaN(amount) || !friendEmail}
        style={!amount || isNaN(amount) || !friendEmail ? disabledButtonStyle : buttonStyle}
      >
        Confirm Bet
      </button>
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={backButtonStyle}
      >
        ◀ Back
      </button>
    </div>
  );
}