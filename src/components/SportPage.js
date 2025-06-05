import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUpcomingGames } from '../utils/api';
import { BetsContext } from '../App';

const leagueMap = { nba: 1, mlb: 2, wnba: 3, golf: 4, nascar: 5, soccer: 6, mma: 7, tennis: 8 };

export default function SportPage() {
  const { key } = useParams();
  const navigate = useNavigate();
  const { bets, setBets } = useContext(BetsContext);
  const [games, setGames] = useState([]);         // 1) default to empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [userPick, setUserPick] = useState('A');
  const [inviteEmail, setInviteEmail] = useState('');

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

  const containerStyle = {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    justifyItems: 'center'
  };

  const orbStyle = {
    position: 'relative',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '4px solid white',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    padding: '12px',
    margin: '10px'
  };

  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 15px 20px -5px rgba(0, 0, 0, 0.2)'
  };

  const teamStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px'
  };

  const dateStyle = {
    fontSize: '14px',
    textAlign: 'center',
    opacity: '0.9'
  };

  const ringStyle = {
    position: 'absolute',
    inset: '0',
    borderRadius: '50%',
    border: '2px solid white',
    opacity: '0.3'
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    padding: '0 24px'
  };
  
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: selectedGame ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };
  
  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
  
  const modalGameOrbStyle = {
    position: 'relative',
    width: '150px',
    height: '150px',
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
    marginBottom: '24px'
  };
  
  const teamButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
    width: '100%'
  };
  
  const teamButtonStyle = (isSelected) => ({
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: isSelected 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
      : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '4px solid white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    padding: '8px',
    textAlign: 'center'
  });
  
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '24px'
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
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
  
  const closeButtonStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280'
  };

  function createBet() {
    const opponentPick = userPick === 'A' ? 'B' : 'A';
    const newBet = {
      id: bets.length,        // simple incrementing id
      gameId: selectedGame.id,
      game: selectedGame,
      picks: { userA: userPick, userB: opponentPick },
      emails: { userA: 'you', userB: inviteEmail },
      amount: null,
      status: 'pending',      // will become 'accepted' in WagerPage
    };

    setBets([...bets, newBet]);
    setSelectedGame(null); // Close modal
    navigate(`/wager/${newBet.id}`);
  }
  
  function closeModal() {
    setSelectedGame(null);
    setUserPick('A');
    setInviteEmail('');
  }

  if (loading) return <p style={{ padding: '16px' }}>Loading {key.toUpperCase()} games…</p>;
  if (error)   return <p style={{ padding: '16px', color: '#dc2626' }}>Error loading games.</p>;
  if (!games.length) return <p style={{ padding: '16px' }}>No upcoming {key.toUpperCase()} games found.</p>;

  return (
    <div>
      <h1 style={headerStyle}>{key.toUpperCase()} Upcoming Games</h1>
      <div style={containerStyle}>
        {games.map((g) => (
          <div 
            key={g.id} 
            onClick={() => setSelectedGame(g)}
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            <div 
              style={orbStyle}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = orbStyle.boxShadow;
              }}
            >
              <div style={teamStyle}>{g.teams.home.name} vs {g.teams.away.name}</div>
              <div style={dateStyle}>{new Date(g.date).toLocaleDateString()}</div>
              
              {/* Decorative ring */}
              <div style={ringStyle}></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Game Selection Modal */}
      <div style={modalOverlayStyle} onClick={closeModal}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <button style={closeButtonStyle} onClick={closeModal}>×</button>
          
          {selectedGame && (
            <>
              {/* Game Info Orb */}
              <div style={modalGameOrbStyle}>
                <div style={teamStyle}>{selectedGame.teams.home.name} vs {selectedGame.teams.away.name}</div>
                <div style={dateStyle}>{new Date(selectedGame.date).toLocaleDateString()}</div>
                <div style={ringStyle}></div>
              </div>
              
              {/* Team Selection */}
              <h3 style={{ marginBottom: '16px', fontWeight: 'bold' }}>Pick Your Team</h3>
              <div style={teamButtonContainerStyle}>
                <div 
                  style={teamButtonStyle(userPick === 'A')}
                  onClick={() => setUserPick('A')}
                >
                  {selectedGame.teams.home.name}
                </div>
                <div 
                  style={teamButtonStyle(userPick === 'B')}
                  onClick={() => setUserPick('B')}
                >
                  {selectedGame.teams.away.name}
                </div>
              </div>
              
              {/* Email Input */}
              <input
                type="email"
                placeholder="Friend's email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={inputStyle}
              />
              
              {/* Create Bet Button */}
              <button
                onClick={createBet}
                disabled={!inviteEmail}
                style={!inviteEmail ? disabledButtonStyle : buttonStyle}
              >
                Create Bet
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}