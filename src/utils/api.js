import mock from './mockGames';
import axios from 'axios';

const MLB_API_KEY = process.env.REACT_APP_MLB_API_KEY;
const NBA_API_KEY = process.env.REACT_APP_NBA_API_KEY;
const GOLF_API_KEY = process.env.REACT_APP_GOLF_API_KEY || '2cdab800424a4bf4a7a423bd54144c31';
const NASCAR_API_KEY = process.env.REACT_APP_NASCAR_API_KEY || '6051d47623db4feaa33d3198804bc24a';
const SOCCER_API_KEY = process.env.REACT_APP_SOCCER_API_KEY || 'c3a5188ea04e41aebc56bc84c707a49d';
const MMA_API_KEY = process.env.REACT_APP_MMA_API_KEY || 'c8ba2d349157467492937405911321f3';

// Create separate client instances for each sport
const mlbClient = axios.create({
  baseURL: '/v3',
  headers: { 'Ocp-Apim-Subscription-Key': MLB_API_KEY },
});

const nbaClient = axios.create({
  baseURL: '/v3',
  headers: { 'Ocp-Apim-Subscription-Key': NBA_API_KEY },
});

const golfClient = axios.create({
  baseURL: '/v3',
  headers: { 'Ocp-Apim-Subscription-Key': GOLF_API_KEY },
});

const nascarClient = axios.create({
  baseURL: '/v3',
  headers: { 'Ocp-Apim-Subscription-Key': NASCAR_API_KEY },
});

const soccerClient = axios.create({
  baseURL: '/v3',
  headers: { 'Ocp-Apim-Subscription-Key': SOCCER_API_KEY },
});

const mmaClient = axios.create({
  baseURL: '/v3',
  headers: { 'Ocp-Apim-Subscription-Key': MMA_API_KEY },
});

/**
 * Returns either mock data or real sportsdata.io data for games based on the league.
 */
export async function fetchUpcomingGames(leagueId) {
  const currentYear = new Date().getFullYear();
  
  try {
    // MLB data (leagueId = 2)
    if (leagueId === 2 && MLB_API_KEY) {
      const res = await mlbClient.get(`/mlb/scores/json/Games/${currentYear}`);
      return transformGamesData(res.data, leagueId);
    }
    
    // NBA data (leagueId = 1)
    if (leagueId === 1 && NBA_API_KEY) {
      console.log('Fetching NBA games with API key:', NBA_API_KEY.substring(0, 5) + '...');
      
      try {
        const nextYear = currentYear + 1;
        console.log(`Trying to fetch NBA games for ${nextYear} season`);
        
        const res = await nbaClient.get(`/nba/scores/json/Games/${nextYear}`);
        console.log('NBA API response for next season:', res.data);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Check if we have any upcoming games
          const upcomingGames = transformGamesData(res.data, leagueId);
          
          if (upcomingGames.length > 0) {
            console.log(`Found ${upcomingGames.length} upcoming NBA games for next season`);
            return upcomingGames;
          }
        }
        
        console.log(`No upcoming games found for ${nextYear}, trying current season ${currentYear}`);
        const currentSeasonRes = await nbaClient.get(`/nba/scores/json/Games/${currentYear}`);
        
        if (currentSeasonRes.data && Array.isArray(currentSeasonRes.data)) {
          const upcomingGames = transformGamesData(currentSeasonRes.data, leagueId);
          
          if (upcomingGames.length > 0) {
            console.log(`Found ${upcomingGames.length} upcoming NBA games for current season`);
            return upcomingGames;
          }
        }
        
        console.log('No upcoming NBA games found in API, using mock data');
        return mock[leagueId] || [];
      } catch (error) {
        console.error('NBA API error:', error);
        return mock[leagueId] || [];
      }
    }
    
    if (leagueId === 4 && GOLF_API_KEY) {
      console.log('Fetching Golf tournaments with API key:', GOLF_API_KEY.substring(0, 5) + '...');
      
      try {
        const res = await golfClient.get(`/golf/scores/json/Tournaments/${currentYear}`);
        console.log('Golf API response:', res.data);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const upcomingGames = transformGolfData(res.data);
          
          if (upcomingGames.length > 0) {
            console.log(`Found ${upcomingGames.length} upcoming Golf tournaments`);
            return upcomingGames;
          }
        }
        
        console.log('No upcoming Golf tournaments found in API, using mock data');
        return mock[leagueId] || [];
      } catch (error) {
        console.error('Golf API error:', error);
        return mock[leagueId] || [];
      }
    }
    
    if (leagueId === 5 && NASCAR_API_KEY) {
      console.log('Fetching NASCAR races with API key:', NASCAR_API_KEY.substring(0, 5) + '...');
      
      try {
        const res = await nascarClient.get(`/nascar/v2/json/races/${currentYear}`);
        console.log('NASCAR API response:', res.data);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const upcomingGames = transformNascarData(res.data);
          
          if (upcomingGames.length > 0) {
            console.log(`Found ${upcomingGames.length} upcoming NASCAR races`);
            return upcomingGames;
          }
        }
        
        console.log('No upcoming NASCAR races found in API, using mock data');
        return mock[leagueId] || [];
      } catch (error) {
        console.error('NASCAR API error:', error);
        return mock[leagueId] || [];
      }
    }
    
    if (leagueId === 6 && SOCCER_API_KEY) {
      console.log('Fetching Soccer matches with API key:', SOCCER_API_KEY.substring(0, 5) + '...');
      
      try {
        const res = await soccerClient.get(`/soccer/scores/json/SchedulesBasic/EPL/${currentYear}`);
        console.log('Soccer API response:', res.data);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const upcomingGames = transformSoccerData(res.data);
          
          if (upcomingGames.length > 0) {
            console.log(`Found ${upcomingGames.length} upcoming Soccer matches`);
            return upcomingGames;
          }
        }
        
        console.log('No upcoming Soccer matches found in API, using mock data');
        return mock[leagueId] || [];
      } catch (error) {
        console.error('Soccer API error:', error);
        return mock[leagueId] || [];
      }
    }
    
    if (leagueId === 7 && MMA_API_KEY) {
      console.log('Fetching MMA events with API key:', MMA_API_KEY.substring(0, 5) + '...');
      
      try {
        const res = await mmaClient.get(`/mma/scores/json/Schedule/UFC/${currentYear}`);
        console.log('MMA API response:', res.data);
        
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const upcomingGames = transformMmaData(res.data);
          
          if (upcomingGames.length > 0) {
            console.log(`Found ${upcomingGames.length} upcoming MMA events`);
            return upcomingGames;
          }
        }
        
        console.log('No upcoming MMA events found in API, using mock data');
        return mock[leagueId] || [];
      } catch (error) {
        console.error('MMA API error:', error);
        return mock[leagueId] || [];
      }
    }
    
    // Fallback to mock data for Tennis and WNBA or if API keys are not set
    return mock[leagueId] || [];
  } catch (error) {
    console.error(`API error for league ${leagueId}:`, error);
    return mock[leagueId] || [];
  }
}

/**
 * Hard-coded sport list for Home.js
 */
export async function fetchLeagues() {
  return [
    { id: 1, key: 'nba',    name: 'NBA',    icon: '/icons/nba.png'    },
    { id: 2, key: 'mlb',    name: 'MLB',    icon: '/icons/mlb.png'    },
    { id: 3, key: 'wnba',   name: 'WNBA',   icon: '/icons/wnba.png'   },
    { id: 4, key: 'golf',   name: 'Golf',   icon: '/icons/golf.png'   },
    { id: 5, key: 'nascar', name: 'NASCAR', icon: '/icons/nascar.png' },
    { id: 6, key: 'soccer', name: 'Soccer', icon: '/icons/soccer.png' },
    { id: 7, key: 'mma',    name: 'MMA',    icon: '/icons/mma.png'    },
    { id: 8, key: 'tennis', name: 'Tennis', icon: '/icons/tennis.png' },
  ];
}

/**
 * Transform sportsdata.io API response to match our app's expected format
 */
function transformGamesData(gamesData, leagueId) {
  if (!Array.isArray(gamesData)) {
    return [];
  }
  
  // Filter for upcoming games (not yet started)
  const now = new Date();
  const upcomingGames = gamesData.filter(game => {
    const gameDate = new Date(game.DateTime || game.Day);
    return gameDate > now && (game.Status === 'Scheduled' || game.Status === 'Scheduled (Time TBD)');
  }).slice(0, 10); // Limit to 10 upcoming games
  
  return upcomingGames.map(game => {
    // Handle different API response formats for MLB and NBA
    if (leagueId === 1) { // NBA
      return {
        id: game.GameID,
        date: game.DateTime || game.Day,
        teams: {
          home: {
            name: game.HomeTeam,
            abbr: game.HomeTeamKey || game.HomeTeam
          },
          away: {
            name: game.AwayTeam,
            abbr: game.AwayTeamKey || game.AwayTeam
          }
        }
      };
    } else { // MLB
      return {
        id: game.GameID,
        date: game.DateTime || game.Day,
        teams: {
          home: {
            name: game.HomeTeam,
            abbr: game.HomeTeamKey || game.HomeTeam
          },
          away: {
            name: game.AwayTeam,
            abbr: game.AwayTeamKey || game.AwayTeam
          }
        }
      };
    }
  });
}

/**
 * Transform Golf API response to match our app's expected format
 */
function transformGolfData(tournamentsData) {
  if (!Array.isArray(tournamentsData)) {
    return [];
  }
  
  // Filter for upcoming tournaments
  const now = new Date();
  const upcomingTournaments = tournamentsData.filter(tournament => {
    const startDate = new Date(tournament.StartDate);
    return startDate > now;
  }).slice(0, 10);
  
  return upcomingTournaments.map((tournament, index) => {
    return {
      id: tournament.TournamentID || index + 4001,
      date: tournament.StartDate,
      teams: {
        home: {
          name: "Tiger Woods", // Default to mock data since we don't have player info
          abbr: "TIG"
        },
        away: {
          name: "Rory McIlroy",
          abbr: "ROR"
        }
      },
      tournamentName: tournament.Name
    };
  });
}

/**
 * Transform NASCAR API response to match our app's expected format
 */
function transformNascarData(racesData) {
  if (!Array.isArray(racesData)) {
    return [];
  }
  
  // Filter for upcoming races
  const now = new Date();
  const upcomingRaces = racesData.filter(race => {
    const raceDate = new Date(race.DateTime || race.Day || race.Date);
    return raceDate > now;
  }).slice(0, 10);
  
  return upcomingRaces.map((race, index) => {
    return {
      id: race.RaceID || index + 5001,
      date: race.DateTime || race.Day || race.Date,
      teams: {
        home: {
          name: "Kyle Larson", // Default to mock data since we don't have driver info
          abbr: "LAR"
        },
        away: {
          name: "Chase Elliott",
          abbr: "ELL"
        }
      },
      raceName: race.Name
    };
  });
}

/**
 * Transform Soccer API response to match our app's expected format
 */
function transformSoccerData(matchesData) {
  if (!Array.isArray(matchesData)) {
    return [];
  }
  
  // Filter for upcoming matches
  const now = new Date();
  const upcomingMatches = matchesData.filter(match => {
    const matchDate = new Date(match.DateTime || match.Day || match.Date);
    return matchDate > now && match.Status === 'Scheduled';
  }).slice(0, 10);
  
  return upcomingMatches.map(match => {
    return {
      id: match.GameID || match.MatchID,
      date: match.DateTime || match.Day || match.Date,
      teams: {
        home: {
          name: match.HomeTeam || match.HomeTeamName,
          abbr: match.HomeTeamKey || match.HomeTeamShort || match.HomeTeam
        },
        away: {
          name: match.AwayTeam || match.AwayTeamName,
          abbr: match.AwayTeamKey || match.AwayTeamShort || match.AwayTeam
        }
      }
    };
  });
}

/**
 * Transform MMA API response to match our app's expected format
 */
function transformMmaData(eventsData) {
  if (!Array.isArray(eventsData)) {
    return [];
  }
  
  // Filter for upcoming events
  const now = new Date();
  const upcomingEvents = eventsData.filter(event => {
    const eventDate = new Date(event.DateTime || event.Day || event.Date);
    return eventDate > now;
  }).slice(0, 10);
  
  return upcomingEvents.map((event, index) => {
    return {
      id: event.EventID || index + 7001,
      date: event.DateTime || event.Day || event.Date,
      teams: {
        home: {
          name: event.MainFighter1 || "Jon Jones", // Default to mock data if no fighter info
          abbr: event.MainFighter1Short || "JON"
        },
        away: {
          name: event.MainFighter2 || "Francis Ngannou",
          abbr: event.MainFighter2Short || "FRA"
        }
      },
      eventName: event.Name
    };
  });
}