const db = require('../config/db');

exports.list = async ({ status, league, round, page = 1, pageSize = 20 }) => {
  const offset = (page - 1) * pageSize;
  const params = [];
  const where = [];
  if (status) { params.push(status); where.push(`status = $${params.length}`); }
  if (league) { params.push(league); where.push(`league = $${params.length}`); }
  if (round)  { params.push(round);  where.push(`round = $${params.length}`); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT id, league, round, date_time, venue, status,
           home_team_id, away_team_id, score_home, score_away
    FROM matches
    ${whereSql}
    ORDER BY date_time DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;
  const result = await db.query(sql, params);
  return result.rows;
};

exports.detail = async (id) => {
  const matchRes = await db.query('SELECT * FROM matches WHERE id = $1', [id]);
  if (!matchRes.rows.length) return null;
  const match = matchRes.rows[0];

  const lineupRes = await db.query(
    'SELECT side, player_id, is_starter FROM lineups WHERE match_id = $1',
    [id]
  );
  const starters = lineupRes.rows.filter(r => r.is_starter);
  const bench = lineupRes.rows.filter(r => !r.is_starter);

  return { ...match, lineup: { starters, bench } };
};

exports.upsertResult = async (id, body) => {
  const { score_home = null, score_away = null, status = null } = body;
  const res = await db.query(
    `UPDATE matches SET
      score_home = COALESCE($1, score_home),
      score_away = COALESCE($2, score_away),
      status = COALESCE($3, status),
      updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [score_home, score_away, status, id]
  );
  return res.rows[0];
};

exports.upsertLineup = async (matchId, body) => {
  const { lineup = [] } = body; // [{player_id, side('home'|'away'), is_starter}]
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM lineups WHERE match_id = $1', [matchId]);
    for (const item of lineup) {
      await client.query(
        `INSERT INTO lineups (match_id, player_id, side, is_starter)
         VALUES ($1,$2,$3,$4)`,
        [matchId, item.player_id, item.side, !!item.is_starter]
      );
    }
    await client.query('COMMIT');
    return { matchId, count: lineup.length };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

