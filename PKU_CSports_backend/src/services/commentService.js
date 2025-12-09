const db = require('../config/db');

exports.create = async ({ postId, userId, content, parentId = null }) => {
  const res = await db.query(
    `INSERT INTO comments (post_id, user_id, content, parent_id)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [postId, userId, content, parentId]
  );
  return res.rows[0];
};

exports.list = async (postId) => {
  const res = await db.query(
    `SELECT c.*, u.username 
     FROM comments c 
     LEFT JOIN users u ON u.id = c.user_id
     WHERE post_id = $1
     ORDER BY created_at ASC`,
    [postId]
  );
  return res.rows;
};

