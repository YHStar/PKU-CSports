## 登录与鉴权（供与后端讨论）

本文档用于前端与后端对接时快速确认登录/鉴权相关接口、请求/响应格式、安全要求与测试要点。

---

### 1) 登录（必需）
- 路径：`POST /api/auth/login`
# AUTH API Discussion

目的：为前后端联调准备清晰的登录/鉴权接口规范、示例与联调要点，便于快速对接与测试。

版本与路径约定（建议）
- 建议 API 版本化：例如 `/api/v1/auth/...`，便于后续扩展与兼容。

通用响应格式（建议）
```
{
  "success": true|false,
  "code": "AUTH_OK" | "AUTH_INVALID_CREDENTIALS" | ... ,
  "message": "Human readable message",
  "data": { ... },
  "requestId": "optional-trace-id"
}
```

常用 HTTP 状态码映射（建议）
- 200: 成功
- 400: 请求参数错误（字段级错误可以返回 `errors` 列表）
- 401: 未认证 / token 无效
- 403: 被禁止（账号锁定/未激活/无权限）
- 429: 速率限制
- 500: 服务端错误

---

1) 登录（必需）
- 路径：`POST /api/v1/auth/login`

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
  "username": "",
  "password": ""
}
```

- 成功示例（HTTP 200）：
```
{
  "success": true,
  "code": "AUTH_OK",
  "data": {
    "token": "<access_token>",
    "refreshToken": "<refresh_token_optional>",
    "expiresIn": 3600,
    "user": { "id":"123", "username":"zhangsan", "roles":["user"], "avatar":"/..." }

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
- 失败示例（HTTP 401）：
```
{ "success": false, "code": "AUTH_INVALID_CREDENTIALS", "message": "用户名或密码错误" }
```

注意事项：
- 明确 token 类型（建议 `Bearer` JWT），并说明签名算法（HS256/RS256）与常用 claims（`exp`/`iat`/`sub`/`roles`）。
- 明确 `refreshToken` 是否启用、是否旋转（rotation）、是否可撤销。

---

2) 获取当前用户（必需）
- 路径：`GET /api/v1/auth/me`
- Header：`Authorization: Bearer <token>`
- 成功示例：
```
{ "success": true, "data": { "id":"123","username":"zhangsan","roles":["user"],"email":"x@pku.edu.cn" } }

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

3) 刷新 token（推荐）
- 路径：`POST /api/v1/auth/refresh`
- 请求体：
```
{ "refreshToken": "..." }
```
- 成功返回新的 access token（与可选新的 refresh token）并说明 `expiresIn`。

前端期望行为：在收到 401 后先尝试一次 refresh；若 refresh 成功则重试原请求，若失败则跳转登录。

并发场景：前端应实现“单次刷新队列化”以避免多个并发请求触发多次 refresh。

---

4) 登出（可选）
- 路径：`POST /api/v1/auth/logout`
- 用途：撤销 refresh token（如果后端保存），帮助立即登出并使 refresh 无效。

---

5) 注册与找回密码（可选）
- 注册：`POST /api/v1/auth/register`（请求需包含必要的字段，返回与登录相似的结构或指示成功）
- 找回密码：`POST /api/v1/auth/password-reset` 与 `POST /api/v1/auth/password-reset/confirm`

---

6) CORS / Cookie / CSRF（Web 注意）
- 若使用 HttpOnly cookie（推荐用于 refresh token）：
  - 返回 `Access-Control-Allow-Credentials: true`，并在允许的 origin 列表中包含前端地址
  - Cookie 设置 `HttpOnly; Secure; SameSite`（根据需求选择 `Lax`/`Strict`）
- 若使用 Authorization header：后端需允许 `Authorization` header（`Access-Control-Allow-Headers` 包含 `Authorization, Content-Type`）。
- 若使用 cookie 并涉及写操作，请设计 CSRF 防护（双重提交 cookie / CSRF token）。

---

7) 字段级错误与验证
- 对于请求参数错误，建议返回 `400` 并包含 `errors` 数组：
```
{ "success": false, "code": "VALIDATION_ERROR", "errors": [ { "field":"password", "message":"至少6位" } ] }
```

---

8) 安全建议与运营策略
- 密码后端使用强哈希（bcrypt/argon2）并加盐存储。
- access token 建议短期（例如 1 小时），refresh token 长期且可撤销。
- 登录失败限流（如 5 次/分钟或账号/IP 限制），必要时触发验证码或短期锁定。
- 日志中避免输出敏感信息（密码、token），但需保留 `requestId` 以便排查。

---

9) 前端与联调约定（建议）
- Authorization header：`Authorization: Bearer <token>`
- storage key（建议）：`token`, `refreshToken`, `userInfo`
- token 过期处理：遇到 401 -> 调用 `/auth/refresh` -> 成功重试原请求，失败跳登录
- 并发刷新：前端实现队列化，保证只有一次 refresh 请求。

---

10) 测试用例（可拷贝到 `requests_test.http`）

POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

```

main
{
  "username": "testuser",
  "password": "password123"
}
```

- 获取当前用户：

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer <access_token>
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer <access_token>

POST http://localhost:3000/api/v1/auth/refresh
Content-Type: application/json

```
{ "refreshToken": "<refresh_token>" }

```

---

如需我把这些示例同时加入仓库根目录下的 `requests_test.http`（或生成一个新的）以便后端直接运行测试，我可以一并创建。

请确认文件名与格式是否满意，或告诉我需要补充/删减的点。
11) 建议补充（可选）
- 错误 code 列表（`AUTH_INVALID_CREDENTIALS`, `AUTH_TOKEN_EXPIRED`, `AUTH_ACCOUNT_LOCKED`, `VALIDATION_ERROR` 等）
- API 返回示例加入 `requestId` 与 `code` 有助于前端做更精确的错误处理与国际化
- 若同意，我可将这些测试用例写入根目录的 `requests_test.http`，并在前端项目中创建 `src/utils/api.js` 封装 `uni.request`。

---

如需我把这个文档调整成 OpenAPI 草案或把 `requests_test.http` 一并创建，请回复我想要的下一步。

