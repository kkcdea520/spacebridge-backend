import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 订阅验证规则
const subscriptionValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('邮箱不能为空')
    .isEmail()
    .withMessage('邮箱格式不正确')
    .normalizeEmail()
];

// 订阅邮件
router.post('/', subscriptionValidation, async (req: Request, res: Response) => {
  try {
    // 验证请求
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // 检查是否已订阅
    const existing = await prisma.subscription.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({
          success: false,
          error: '该邮箱已订阅'
        });
      }
      
      // 重新激活订阅
      const subscription = await prisma.subscription.update({
        where: { email },
        data: { status: 'active' }
      });

      return res.json({
        success: true,
        message: '订阅成功！',
        data: {
          email: subscription.email,
          subscribedAt: subscription.createdAt
        }
      });
    }

    // 创建新订阅
    const subscription = await prisma.subscription.create({
      data: {
        email,
        status: 'active'
      }
    });

    res.status(201).json({
      success: true,
      message: '订阅成功！',
      data: {
        email: subscription.email,
        subscribedAt: subscription.createdAt
      }
    });
  } catch (error) {
    console.error('订阅失败:', error);
    res.status(500).json({
      success: false,
      error: '订阅失败，请稍后重试'
    });
  }
});

// 退订
router.delete('/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const subscription = await prisma.subscription.update({
      where: { email },
      data: { status: 'unsubscribed' }
    });

    res.json({
      success: true,
      message: '退订成功'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: '订阅记录不存在'
    });
  }
});

// 获取订阅列表（管理）
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const where = status ? { status } : {};

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.subscription.count({ where })
    ]);

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取订阅列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

export default router;
