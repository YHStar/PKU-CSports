const db = require('../config/db');

exports.list = async ({ type, tag, page = 1, pageSize = 10 }) => {
  const offset = (page - 1) * pageSize;
  const params = [];
  let where = [];

  if (type && type !== 'all') {
    params.push(type);
    where.push(`type = $${params.length}`);
  }
  if (tag) {
    params.push(tag);
    where.push(`$${params.length} = ANY(tags)`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `
    SELECT id, title, type, tags, cover, created_at, updated_at, author_id
    FROM posts
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;
  const result = await db.query(sql, params);
  return result.rows;
};

exports.detail = async (id) => {
  const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
};

exports.create = async (payload) => {
  const { title = '', content = '', type = 'post', tags = [], cover = '', authorId } = payload;
  const result = await db.query(
    `INSERT INTO posts (title, content, type, tags, cover, author_id, status) 
     VALUES ($1,$2,$3,$4,$5,$6,'published') RETURNING *`,
    [title, content, type, tags, cover, authorId]
  );
  return result.rows[0];
};

exports.update = async (id, payload) => {
  const { title, content, type, tags, cover, status } = payload;
  const result = await db.query(
    `UPDATE posts SET 
      title = COALESCE($1,title),
      content = COALESCE($2,content),
      type = COALESCE($3,type),
      tags = COALESCE($4,tags),
      cover = COALESCE($5,cover),
      status = COALESCE($6,status),
      updated_at = NOW()
    WHERE id = $7 RETURNING *`,
    [title, content, type, tags, cover, status, id]
  );
  return result.rows[0];
};

