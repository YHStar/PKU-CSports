# 🏀 CSports 校园体育赛事数据平台
## 项目开发规范文档（Project Development Guidelines）

> 本文档用于规范团队开发流程、代码风格与协作方式，确保项目开发高效、有序、可维护。

---

## 一、项目结构与职责划分

### 📦 项目结构建议
```
CSports/
├── backend/              # 后端服务（Node.js + Express）
│   ├── src/
│   ├── package.json
│   └── README.md
├── web/                  # Electron 网页端
│   ├── src/
│   ├── package.json
│   └── README.md
├── android/              # 安卓端（Android Studio）
│   ├── app/
│   └── README.md
├── docs/                 # 文档（接口文档、原型、设计稿）
│   ├── api.md
│   ├── database-design.md
│   └── ui-prototype.png
└── PROJECT_GUIDELINES.md # 本规范文件
```

---

## 二、Git 协作规范

### 🪜 分支模型
```
main             # 主分支，保存稳定可发布版本
develop          # 开发分支，合并各功能分支
feature/x        # 新功能开发分支（如 feature/login）
fix/x            # Bug修复分支（如 fix/login-crash）
```

### 🔖 分支命名规范
| 类型 | 命名格式 | 示例 |
|------|-----------|------|
| 新功能 | feature/模块名 | feature/match-list |
| 修复 | fix/问题简述 | fix/api-timeout |
| 文档 | doc/文件名 | doc/update-readme |

---

### 💬 Commit 提交规范
采用 **Angular Commit Message** 风格：

| 前缀 | 说明 | 示例 |
|------|------|------|
| feat | 新功能 | `feat: add match schedule API` |
| fix | 修复 bug | `fix: correct score display` |
| refactor | 重构代码 | `refactor: optimize user login logic` |
| style | 样式或排版调整 | `style: update header font size` |
| doc | 文档更新 | `doc: add API usage examples` |
| test | 测试代码 | `test: add unit test for match API` |

> 每次提交应确保功能可运行，注释清晰，不提交无意义内容（如调试日志、编译文件）。

---

## 三、代码风格与命名规范

### 🌐 通用命名规则
| 类型 | 命名规则 | 示例 |
|------|-----------|------|
| 变量 | 小驼峰（camelCase） | `matchList`, `playerName` |
| 函数 | 动词 + 名词 | `getMatchData()`, `updateUserScore()` |
| 类名 | 大驼峰（PascalCase） | `MatchController`, `UserService` |
| 常量 | 全大写 + 下划线 | `MAX_SCORE`, `API_URL` |
| 数据库表 | 下划线命名 | `match_result`, `team_info` |
| 文件 | 小写 + 中划线 | `match-service.js`, `user-api.js` |

---

### 🧱 前端代码风格

#### **Electron (Web)**
- 使用 **ESLint + Prettier** 检查格式  
  - 执行命令：
    ```bash
    npm run lint
    npm run format
    ```
- 禁止无意义 `console.log`
- 推荐文件结构：
  ```
  src/
  ├── components/
  ├── pages/
  ├── api/
  ├── store/
  └── utils/
  ```

#### **Android (App)**
- 统一使用 Kotlin（若部分成员熟悉 Java，可混用）
- 文件结构：
  ```
  com.campus.csports/
  ├── ui/
  ├── data/
  ├── network/
  ├── viewmodel/
  └── utils/
  ```
- XML 文件命名：`activity_main.xml`, `fragment_match.xml`
- 遵循 MVVM 架构（建议）

---

### ⚙️ 后端代码风格（Node.js + Express）
- 控制器、服务、模型分层：
  ```
  src/
  ├── controllers/
  ├── services/
  ├── models/
  ├── routes/
  ├── middleware/
  └── config/
  ```
- 推荐返回格式：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": { "match_id": 1, "score": "2-1" }
  }
  ```
- 错误统一用：
  ```json
  {
    "code": 500,
    "message": "internal server error"
  }
  ```

---

## 四、接口规范（API Design）

### 🌍 基本规范
- 所有接口路径以 `/api` 开头  
- 使用 RESTful 风格：
  | 操作 | 方法 | 示例 |
  |------|------|------|
  | 获取列表 | GET | `/api/matches` |
  | 获取详情 | GET | `/api/match/:id` |
  | 新增 | POST | `/api/match` |
  | 修改 | PUT | `/api/match/:id` |
  | 删除 | DELETE | `/api/match/:id` |

### 📄 接口示例
**接口名称**：获取比赛列表  
**URL**：`/api/match/list`  
**方法**：`GET`  
**参数**：
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| team_id | int | 否 | 筛选队伍ID |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "match_id": 1,
      "home_team": "信科A队",
      "away_team": "信科B队",
      "score": "2-1",
      "date": "2025-10-01"
    }
  ]
}
```

> 💡 推荐使用 Swagger 自动生成接口文档（访问 `/api-docs` 即可查看）。

---

## 五、协作与管理流程

### 📆 每周例会制度
| 内容 | 说明 |
|------|------|
| 时间 | 每周固定时间（建议周末或课后） |
| 汇报内容 | 每人汇报上周完成内容 + 下周计划 |
| 产出 | 每周开发进度表、任务看板更新 |

---

### 🧩 项目管理工具
推荐使用以下之一：
- **GitHub Projects** / **GitLab Board**  
- **Notion** / **飞书多维表格** / **Trello**

任务卡模板：
| 模块 | 负责人 | 状态 | 截止日期 | 备注 |
|------|----------|------|-----------|------|
| 后端API：match模块 | 张三 | 进行中 | 10.20 | Swagger文档编写中 |
| 安卓端：评论功能 | 李四 | 未开始 | 10.25 | 等接口完成 |
| 网页端：阵容模拟器 | 王五 | 已完成 | 10.15 | 等待测试 |

---

### 🧪 测试规范
| 测试类型 | 内容 |
|-----------|------|
| 单元测试 | 后端API、工具函数 |
| 功能测试 | 用户登录、评论、战报上传 |
| 集成测试 | 前后端联调 |
| 回归测试 | 修复bug后进行 |

测试结果统一记录在 `/docs/test-report.md`

---

### 🚀 部署与版本管理
| 阶段 | 内容 |
|------|------|
| 开发环境 | 本地测试（localhost） |
| 测试环境 | 校内服务器或云测试环境 |
| 发布环境 | 最终展示版（11月中旬） |

版本号格式：`v主版本.次版本.修订号`  
示例：`v1.0.3`


---

## 六、附录：推荐工具

| 类型 | 推荐工具 |
|------|-----------|
| 原型设计 | Figma / 墨刀 / 蓝湖 |
| 接口文档 | Swagger / Postman |
| 项目管理 | Notion / Trello / GitHub Projects |
| 代码协作 | Git + GitHub / GitLab |
| 格式化工具 | ESLint, Prettier, Checkstyle |
| 版本控制 | GitFlow 分支模型 |


