const { Pool } = require('pg');

// IMPORTANT: Replace with your actual PostgreSQL credentials.
// It's highly recommended to use environment variables for this in production.
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'jjh20040306', // <-- 修改为你的 PostgreSQL 密码
  database: process.env.PG_DATABASE || 'csports_db',       // <-- 修改为你的数据库名
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
  max: 10,
  idleTimeoutMillis: 30000,
});

// 测试连接
const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL database connected successfully!');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
  }
};
testConnection();

module.exports = pool;

