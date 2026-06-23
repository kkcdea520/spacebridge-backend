import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';

// 导入路由
import consultationRoutes from './routes/consultation.routes';
import subscriptionRoutes from './routes/subscription.routes';
import feedbackRoutes from './routes/feedback.routes';
import healthRoutes from './routes/health.routes';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app: Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3007;

// 中间件配置
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API路由
app.use('/api/health', healthRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/feedback', feedbackRoutes);

// 管理后台页面
app.get('/admin', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// 根路由
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'SpaceBridge世越装饰官网API服务',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      consultation: '/api/consultation',
      subscription: '/api/subscription',
      feedback: '/api/feedback',
      admin: '/admin'
    }
  });
});

// 404处理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// 全局错误处理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 SpaceBridge后端API服务已启动！');
  console.log('========================================');
  console.log(`📍 本地地址: http://localhost:${PORT}`);
  console.log(`📍 API文档:  http://localhost:${PORT}/api/health`);
  console.log(`🌐 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
  console.log('可用接口:');
  console.log('  ✅ GET  /api/health          - 健康检查');
  console.log('  ✅ POST /api/consultation     - 提交咨询');
  console.log('  ✅ GET  /api/consultation    - 获取咨询列表');
  console.log('  ✅ POST /api/subscription     - 订阅邮件');
  console.log('  ✅ POST /api/feedback        - 提交反馈');
  console.log('========================================');
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n正在关闭服务器...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n正在关闭服务器...');
  await prisma.$disconnect();
  process.exit(0);
});

export { prisma };
