import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 健康检查接口
router.get('/', async (req: Request, res: Response) => {
  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'SpaceBridge Backend API',
      version: '1.0.0',
      database: {
        status: 'connected',
        type: 'SQLite'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

export default router;
