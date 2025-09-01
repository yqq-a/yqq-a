// Cloudflare Worker API 示例
// 这个 Worker 提供了一个简单的 REST API 来管理用户数据

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // 路由处理
      if (path === '/api/users' && method === 'GET') {
        return await getUsers(request);
      } else if (path === '/api/users' && method === 'POST') {
        return await createUser(request);
      } else if (path.startsWith('/api/users/') && method === 'GET') {
        const userId = path.split('/')[3];
        return await getUser(userId);
      } else if (path.startsWith('/api/users/') && method === 'PUT') {
        const userId = path.split('/')[3];
        return await updateUser(userId, request);
      } else if (path.startsWith('/api/users/') && method === 'DELETE') {
        const userId = path.split('/')[3];
        return await deleteUser(userId);
      } else if (path === '/api/health' && method === 'GET') {
        return await healthCheck();
      } else {
        return createResponse({ error: 'Route not found' }, 404);
      }
    } catch (error) {
      console.error('Error:', error);
      return createResponse({ error: 'Internal server error' }, 500);
    }
  }
};

// 模拟用户数据（实际项目中应该使用 KV 存储或数据库）
const mockUsers = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: '2', name: '李四', email: 'lisi@example.com', age: 30 },
  { id: '3', name: '王五', email: 'wangwu@example.com', age: 28 }
];

// 获取所有用户
async function getUsers(request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit')) || 10;
  const offset = parseInt(url.searchParams.get('offset')) || 0;
  
  const paginatedUsers = mockUsers.slice(offset, offset + limit);
  
  return createResponse({
    success: true,
    data: paginatedUsers,
    total: mockUsers.length,
    limit,
    offset
  });
}

// 获取单个用户
async function getUser(userId) {
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return createResponse({ error: 'User not found' }, 404);
  }
  
  return createResponse({
    success: true,
    data: user
  });
}

// 创建用户
async function createUser(request) {
  try {
    const body = await request.json();
    
    // 简单的验证
    if (!body.name || !body.email) {
      return createResponse({
        error: 'Name and email are required'
      }, 400);
    }
    
    // 检查邮箱是否已存在
    if (mockUsers.some(u => u.email === body.email)) {
      return createResponse({
        error: 'Email already exists'
      }, 400);
    }
    
    const newUser = {
      id: String(Date.now()), // 简单的ID生成
      name: body.name,
      email: body.email,
      age: body.age || null,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    return createResponse({
      success: true,
      data: newUser,
      message: 'User created successfully'
    }, 201);
    
  } catch (error) {
    return createResponse({
      error: 'Invalid JSON body'
    }, 400);
  }
}

// 更新用户
async function updateUser(userId, request) {
  try {
    const body = await request.json();
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return createResponse({ error: 'User not found' }, 404);
    }
    
    // 更新用户信息
    const updatedUser = {
      ...mockUsers[userIndex],
      ...body,
      id: userId, // 确保ID不被修改
      updatedAt: new Date().toISOString()
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return createResponse({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
    
  } catch (error) {
    return createResponse({
      error: 'Invalid JSON body'
    }, 400);
  }
}

// 删除用户
async function deleteUser(userId) {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return createResponse({ error: 'User not found' }, 404);
  }
  
  mockUsers.splice(userIndex, 1);
  
  return createResponse({
    success: true,
    message: 'User deleted successfully'
  });
}

// 健康检查
async function healthCheck() {
  return createResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

// 处理 CORS
function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  });
}

// 创建统一的响应格式
function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}