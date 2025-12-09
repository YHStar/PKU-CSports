# PKU CSports 后端接口文档

## 一、后端作用

本后端服务基于 Node.js + Express + PostgreSQL，主要负责：
- 提供校园体育赛事平台的用户认证、数据存储与业务逻辑处理。
- 为前端（Web/移动端）提供统一的 RESTful API。
- 保障数据安全（如密码加密、Token 认证等）。

---

## 二、已实现接口

### 1. 用户登录接口

- **接口地址**：`POST /api/auth/login`
- **完整示例**：`http://localhost:3000/api/auth/login`
- **请求类型**：POST
- **请求头**：`Content-Type: application/json`
- **请求体参数**：

```json
{
  "username": "testuser",
  "password": "password123"
}
```

- **成功响应示例**：

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "<JWT_TOKEN>",
    "user": {
      "id": 1,
      "username": "testuser",
      "role": "user"
    }
  }
}
```

- **失败响应示例**：

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

- **说明**：
  - 登录成功后，前端应保存 `token`，后续访问需要认证的接口时在请求头加上 `Authorization: Bearer <token>`。
  - 用户信息中不包含密码字段。

---

## 三、接口测试方法

### 1. 使用 curl 测试

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"testuser","password":"password123"}'
```

### 2. 使用 VS Code REST Client 插件

在 `requests_test.http` 文件中写入：

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

点击 `Send Request` 按钮即可看到响应。

---

## 四、后续扩展建议

- 增加注册、用户信息查询、赛事数据等接口。
- 所有敏感操作建议加上 JWT Token 校验。
- 数据库连接信息建议用环境变量管理，避免明文泄露。

---

## 五、已扩展接口（资讯/赛程/榜单/评论）

### 1) 资讯 News
- 列表：`GET /api/news?type=flash|report|post|all&tag=&page=1&pageSize=10`
- 详情：`GET /api/news/:id`
- 创建：`POST /api/news`（需角色 association/admin），body: `{title,content,type,tags[],cover}`
- 更新：`PATCH /api/news/:id`（需角色 association/admin）

### 2) 赛程 Matches
- 列表：`GET /api/matches?status=&league=&round=&page=1&pageSize=20`
- 详情：`GET /api/matches/:id`（含 lineup: starters/bench）
- 录入比分：`POST /api/matches/:id/result`（association/admin）`{score_home,score_away,status}`
- 录入阵容：`POST /api/matches/:id/lineup`（association/admin）`{lineup:[{player_id,side,is_starter}]}`

### 3) 榜单 Standings
- 积分榜：`GET /api/standings?league=`
- 球员榜：`GET /api/standings/players?league=&sort=goals|assists`

### 4) 评论 Comments
- 列表：`GET /api/comments/:postId`
- 发表：`POST /api/comments/:postId`（登录）`{content,parentId}`

---

## 六、运行与测试
1. 安装依赖：`npm install`
2. 准备数据库：创建 PostgreSQL 库 `csports_db`，执行 `db/schema.sql`
3. 环境变量（.env 可选）：
```
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=xxxx
PG_DATABASE=csports_db
PG_PORT=5432
JWT_SECRET=your_secret
```
4. 启动：`node src/app.js`
5. 测试：可用 `requests_test.http` 或 curl，例如：
```
GET http://localhost:3000/api/news
POST http://localhost:3000/api/news
Authorization: Bearer <token>
Content-Type: application/json

{ "title":"示例战报","content":"内容","type":"report","tags":["热门"] }
```

---

如需更多接口或有任何问题，请联系后端开发者。
