import mock from './mockGames';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_SPORTS_KEY;

// During development we’re proxying real calls to /v3/sports via CRA’s `"proxy"` setting.
// But for mocks we don’t even hit the network.
const client = axios.create({
  baseURL: '/v3/sports',
  headers: { 'x-apisports-key': API_KEY },
});

/**
 * Returns either your mock data (if no API key is set)
 * or real API-sports.io data for the next 7 days.
 */
export async function fetchUpcomingGames(leagueId) {
  if (!API_KEY) {
    // return an array (possibly empty) of mock games
    return mock[leagueId] || [];
  }

  const now = new Date();
  const from = now.toISOString().split('T')[0];
  const toDate = new Date(now);
  toDate.setDate(toDate.getDate() + 7);
  const to = toDate.toISOString().split('T')[0];

  const res = await client.get(`/games`, {
    params: { league: leagueId, from, to }
  });
  return res.data.response;
}

/**
 * Hard-coded sport list for Home.js
 */
export async function fetchLeagues() {
  return [
    { id: 1, key: 'nba',  name: 'NBA',  icon: '/icons/nba.png'  },
    { id: 2, key: 'mlb',  name: 'MLB',  icon: '/icons/mlb.png'  },
    { id: 3, key: 'wnba', name: 'WNBA', icon: '/icons/wnba.png' },
  ];
}
