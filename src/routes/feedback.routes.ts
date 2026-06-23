import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 反馈验证规则
const feedbackValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('姓名不能为空')
    .isLength({ max: 100 }),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('类型不能为空')
    .isIn(['feedback', 'suggestion', 'complaint'])
    .withMessage('类型无效'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('主题不能为空')
    .isLength({ max: 200 }),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('内容不能为空')
    .isLength({ max: 2000 })
];

// 提交反馈
router.post('/', feedbackValidation, async (req: Request, res: Response) => {
  try {
    // 验证请求
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, type, subject, message } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email: email || null,
        type,
        subject,
        message,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      message: '反馈已提交，感谢您的建议！',
      data: {
        id: feedback.id,
        type: feedback.type,
        subject: feedback.subject,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('提交反馈失败:', error);
    res.status(500).json({
      success: false,
      error: '提交失败，请稍后重试'
    });
  }
});

// 获取反馈列表（管理）
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;
    const status = req.query.status as string;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.feedback.count({ where })
    ]);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取反馈列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 更新反馈状态
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: '状态值无效'
      });
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: '状态更新成功',
      data: feedback
    });
  } catch (error) {
    console.error('更新反馈状态失败:', error);
    res.status(500).json({
      success: false,
      error: '更新失败'
    });
  }
});

// 删除反馈
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.feedback.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除反馈失败:', error);
    res.status(500).json({
      success: false,
      error: '删除失败'
    });
  }
});

export default router;
