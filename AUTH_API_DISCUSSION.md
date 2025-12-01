## 登录与鉴权（供与后端讨论）

本文档用于前端与后端对接时快速确认登录/鉴权相关接口、请求/响应格式、安全要求与测试要点。

---

### 1) 登录（必需）
- 路径：`POST /api/auth/login`
- 请求体（JSON）：

```
{
  "username": "...",
  "password": "..."
}
```

- 成功（HTTP 200）示例：

```
{
  "success": true,
  "data": {
    "token": "<access_token>",
    "refreshToken": "<refresh_token_optional>",
    "user": {
      "id": "...",
      "username": "...",
      "roles": ["user"],
      "avatar": "..."
    },
    "expiresIn": 3600
  }
}
```

- 失败示例：
  - 认证失败：HTTP 401
    ```json
    { "success": false, "message": "Invalid credentials" }
    ```
  - 账户未激活/被禁：HTTP 403
  - 请求参数不合法：HTTP 400

> 建议：统一返回结构（`success`, `message`, `data?`, `code?`），并用 HTTP 状态码区分情况。

---

### 2) 当前用户信息（必需）
- 路径：`GET /api/auth/me` 或 `GET /api/users/me`
- 需要鉴权：`Authorization: Bearer <token>`
- 成功示例（HTTP 200）返回当前登录用户信息，用于前端初始化界面：

```
{
  "success": true,
  "data": { "id": "...", "username": "...", "roles": ["user"], "email": "...", "avatar": "..." }
}
```

---

### 3) 刷新 token（推荐）
- 路径：`POST /api/auth/refresh`
- 请求：`{ "refreshToken": "..." }` 或后端使用 HttpOnly cookie
- 成功：返回新 `token`（和可选的新的 `refreshToken`）与 `expiresIn`。

前端期望：在 access token 过期并收到 401 时能调用此接口自动续期并重试之前的请求。

---

### 4) 登出（可选）
- 路径：`POST /api/auth/logout`
- 作用：撤销 refresh token（若后端保存），便于立即登出。

---

### 5) CORS 与 Cookie（Web 前端注意）
- 若前端为 web 客户端并使用 cookie 鉴权，后端必须：
  - 返回 `Access-Control-Allow-Credentials: true`
  - 在允许的 origin 列表中包含前端地址
  - 设置 cookie属性 `HttpOnly; Secure; SameSite`（按需）
- 若使用 token（Authorization header），后端需允许 `Authorization` 请求头：
  - `Access-Control-Allow-Headers: Authorization, Content-Type`

---

### 6) 错误码与一致性
- 使用一致的响应格式，示例：`{ success: boolean, message?: string, code?: string|number, data?: any }`
- 常用 HTTP 状态码含义建议：
  - 200 成功
  - 400 请求参数错误
  - 401 未认证 / token 无效
  - 403 被禁止（账号被封/无权限）
  - 429 速率限制
  - 500 服务端错误

---

### 7) 安全与实践建议
- 密码后端保存使用 bcrypt/argon2 等强哈希并加盐。
- access token 建议短过期（如 1 小时），refresh token 长一点且可撤销。
- 登录失败需要限流（IP/账号）以防暴力攻击。
- 不在响应中回传过多错误细节（避免泄露用户是否存在等敏感信息），但可在内部日志记录详细信息。

---

### 8) 前端期望的字段（请确认）
- `user.id`、`user.username`、`user.roles`、`user.avatar`（URL 可直接使用）
- `expiresIn`（秒）
- 可选：`user.displayName`、`user.email`、`user.department`（若需要展示）

---

### 9) 测试用例（可直接用 `requests_test.http` 或 Postman）
- 登录成功请求：

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

- 获取当前用户：

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer <access_token>
```

---

如需我把这些示例同时加入仓库根目录下的 `requests_test.http`（或生成一个新的）以便后端直接运行测试，我可以一并创建。

请确认文件名与格式是否满意，或告诉我需要补充/删减的点。
