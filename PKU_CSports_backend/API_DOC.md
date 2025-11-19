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

如需更多接口或有任何问题，请联系后端开发者。
