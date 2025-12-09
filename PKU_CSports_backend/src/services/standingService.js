const db = require('../config/db');

exports.listStandings = async ({ league }) => {
  const params = [];
  const where = [];
  if (league) { params.push(league); where.push(`league = $${params.length}`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT team_id, league, played, win, draw, loss, goals_for, goals_against, points
    FROM standings
    ${whereSql}
    ORDER BY points DESC, (goals_for - goals_against) DESC
  `;
  const res = await db.query(sql, params);
  return res.rows;
};

exports.listPlayerStats = async ({ league, sort = 'goals' }) => {
  const allow = ['goals', 'assists'];
  const orderBy = allow.includes(sort) ? sort : 'goals';
  const params = [];
  const where = [];
  if (league) { params.push(league); where.push(`league = $${params.length}`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT player_id, league, goals, assists
    FROM player_stats
    ${whereSql}
    ORDER BY ${orderBy} DESC
    LIMIT 100
  `;
  const res = await db.query(sql, params);
  return res.rows;
};

