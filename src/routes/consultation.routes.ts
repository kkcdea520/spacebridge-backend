import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { sendConsultationEmail } from '../services/email.service';

const router = Router();
const prisma = new PrismaClient();

// 验证规则
const consultationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('姓名不能为空')
    .isLength({ max: 100 })
    .withMessage('姓名不能超过100个字符'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('电话号码不能为空')
    .matches(/^[\d\s\+\-\(\)]+$/)
    .withMessage('电话号码格式不正确'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('公司名称不能超过200个字符'),
  body('serviceType')
    .trim()
    .notEmpty()
    .withMessage('服务类型不能为空')
    .isIn(['design', 'construction', 'materials', 'consultation', 'other'])
    .withMessage('服务类型无效'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('咨询内容不能为空')
    .isLength({ max: 2000 })
    .withMessage('咨询内容不能超过2000个字符')
];

// 提交咨询表单
router.post('/', consultationValidation, async (req: Request, res: Response) => {
  try {
    // 验证请求
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, phone, email, company, serviceType, message } = req.body;

    // 保存到数据库
    const consultation = await prisma.consultation.create({
      data: {
        name,
        phone,
        email: email || null,
        company: company || null,
        serviceType,
        message,
        status: 'pending'
      }
    });

    // 发送邮件通知
    try {
      await sendConsultationEmail({
        name,
        phone,
        email,
        company,
        serviceType,
        message
      });
    } catch (emailError) {
      console.error('邮件发送失败:', emailError);
      // 邮件发送失败不影响表单提交成功
    }

    res.status(201).json({
      success: true,
      message: '咨询表单提交成功！我们会尽快与您联系。',
      data: {
        id: consultation.id,
        name: consultation.name,
        phone: consultation.phone,
        email: consultation.email,
        company: consultation.company,
        serviceType: consultation.serviceType,
        createdAt: consultation.createdAt
      }
    });
  } catch (error) {
    console.error('提交咨询表单失败:', error);
    res.status(500).json({
      success: false,
      error: '提交失败，请稍后重试'
    });
  }
});

// 获取所有咨询列表（带分页）
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const where = status ? { status } : {};

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.consultation.count({ where })
    ]);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取咨询列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 获取单个咨询详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const consultation = await prisma.consultation.findUnique({
      where: { id }
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: '咨询记录不存在'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('获取咨询详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取数据失败'
    });
  }
});

// 更新咨询状态
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

    const consultation = await prisma.consultation.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: '状态更新成功',
      data: consultation
    });
  } catch (error) {
    console.error('更新咨询状态失败:', error);
    res.status(500).json({
      success: false,
      error: '更新失败'
    });
  }
});

// 删除咨询记录
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.consultation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除咨询失败:', error);
    res.status(500).json({
      success: false,
      error: '删除失败'
    });
  }
});

export default router;
