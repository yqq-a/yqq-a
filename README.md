# Cloudflare Worker API 示例

这是一个使用 Cloudflare Workers 构建的简单 REST API 示例项目，用于管理用户数据。

## 功能特性

- 完整的 CRUD 操作（创建、读取、更新、删除）
- RESTful 路由设计
- CORS 支持
- 错误处理和输入验证
- 分页支持
- 统一的 JSON 响应格式

## API 端点

### 健康检查
```
GET /api/health
```

### 用户管理

#### 获取所有用户
```
GET /api/users?limit=10&offset=0
```

#### 获取单个用户
```
GET /api/users/{id}
```

#### 创建新用户
```
POST /api/users
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25
}
```

#### 更新用户
```
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "新名字",
  "age": 26
}
```

#### 删除用户
```
DELETE /api/users/{id}
```

## 部署到 Cloudflare Workers

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** 部分
3. 点击 **Create application**
4. 选择 **Create Worker**
5. 将 `worker.js` 文件的内容复制到编辑器中
6. 点击 **Save and Deploy**

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": {...},
  "message": "操作成功消息"
}
```

### 错误响应
```json
{
  "error": "错误消息"
}
```

### 分页响应
```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

## 扩展功能

当前版本使用内存存储模拟数据。在生产环境中，建议：

- 使用 Cloudflare KV 存储持久化数据
- 集成 Cloudflare D1 数据库
- 添加身份验证和授权
- 实现更复杂的业务逻辑
- 添加日志记录和监控

## 许可证

MIT License