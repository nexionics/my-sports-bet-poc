import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeagues } from '../utils/api';

export default function Home() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetchLeagues().then(setLeagues);
  }, []);

  const containerStyle = {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    justifyItems: 'center'
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
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  };

  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 15px 20px -5px rgba(0, 0, 0, 0.2)'
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    marginBottom: '8px'
  };

  const nameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
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
      {leagues.map((l) => (
        <Link 
          key={l.key} 
          to={`/sport/${l.key}`}
          style={{ textDecoration: 'none' }}
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
            <img
              src={l.icon}
              alt={l.name}
              style={iconStyle}
            />
            <div style={nameStyle}>{l.name}</div>
            
            {/* Decorative ring */}
            <div style={ringStyle}></div>
          </div>
        </Link>
      ))}
    </div>
  );
}