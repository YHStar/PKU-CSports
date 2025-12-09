-- 用户表：角色区分 user / association / admin
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  avatar TEXT,
  bio TEXT,
  fav_team_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 球队表
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo TEXT,
  league VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 球员表
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  number INTEGER,
  position VARCHAR(20),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 赛程/比赛
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  league VARCHAR(50),
  round VARCHAR(50),
  date_time TIMESTAMP,
  venue VARCHAR(200),
  status VARCHAR(30) DEFAULT '未开始',
  home_team_id INTEGER REFERENCES teams(id),
  away_team_id INTEGER REFERENCES teams(id),
  score_home INTEGER,
  score_away INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 阵容表
CREATE TABLE IF NOT EXISTS lineups (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  side VARCHAR(10) CHECK (side IN ('home','away')),
  is_starter BOOLEAN DEFAULT true
);

-- 积分榜
CREATE TABLE IF NOT EXISTS standings (
  id SERIAL PRIMARY KEY,
  league VARCHAR(50),
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  played INTEGER DEFAULT 0,
  win INTEGER DEFAULT 0,
  draw INTEGER DEFAULT 0,
  loss INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0
);

-- 球员数据
CREATE TABLE IF NOT EXISTS player_stats (
  id SERIAL PRIMARY KEY,
  league VARCHAR(50),
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0
);

-- 帖子/资讯
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  type VARCHAR(20) DEFAULT 'post', -- flash/report/post
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  cover TEXT,
  author_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 简单索引
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

