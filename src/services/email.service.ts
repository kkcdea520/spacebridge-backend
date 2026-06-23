import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.qq.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// 服务类型映射
const serviceTypeMap: Record<string, { zh: string; vi: string }> = {
  design: { zh: '设计方案', vi: 'Thiết kế' },
  construction: { zh: '施工服务', vi: 'Thi công' },
  materials: { zh: '材料供应', vi: 'Cung cấp vật liệu' },
  consultation: { zh: '咨询服务', vi: 'Tư vấn' },
  other: { zh: '其他', vi: 'Khác' }
};

export interface ConsultationData {
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  serviceType: string;
  message: string;
}

// 发送咨询邮件通知
export async function sendConsultationEmail(data: ConsultationData): Promise<void> {
  const serviceType = serviceTypeMap[data.serviceType] || { zh: '未知', vi: 'Không xác định' };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A1628 0%, #1a365d 100%); padding: 30px; text-align: center;">
        <h1 style="color: #C9A962; margin: 0; font-size: 24px;">🏗️ SpaceBridge世越装饰</h1>
        <p style="color: #ffffff; margin: 10px 0 0 0;">新的客户咨询</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px;">
        <h2 style="color: #0A1628; margin-top: 0;">📋 咨询详情</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">客户姓名：</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">联系电话：</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">
              <a href="tel:${data.phone}" style="color: #C9A962; text-decoration: none;">${data.phone}</a>
            </td>
          </tr>
          ${data.email ? `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">电子邮箱：</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">
              <a href="mailto:${data.email}" style="color: #C9A962; text-decoration: none;">${data.email}</a>
            </td>
          </tr>
          ` : ''}
          ${data.company ? `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">公司名称：</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${data.company}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd; font-weight: bold;">服务类型：</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">
              <span style="background: #C9A962; color: #fff; padding: 4px 12px; border-radius: 4px;">
                ${serviceType.zh} / ${serviceType.vi}
              </span>
            </td>
          </tr>
        </table>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #0A1628; margin-bottom: 10px;">📝 咨询内容：</h3>
          <div style="background: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #C9A962;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #fff; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #666;">
            请尽快回复此咨询 | Vui lòng phản hồi sớm nhất có thể
          </p>
          <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
            提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Ho_Chi_Minh' })}
          </p>
        </div>
      </div>
      
      <div style="background: #0A1628; color: #fff; padding: 20px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">SpaceBridge世越装饰 - 中资企业出海越南工装全链条服务专家</p>
        <p style="margin: 5px 0 0 0;">Website: https://spacebridge-com.netlify.app</p>
      </div>
    </div>
  `;

  const textContent = `
SpaceBridge世越装饰 - 新的客户咨询

=====================================

客户姓名：${data.name}
联系电话：${data.phone}
${data.email ? `电子邮箱：${data.email}` : ''}
${data.company ? `公司名称：${data.company}` : ''}
服务类型：${serviceType.zh} / ${serviceType.vi}

=====================================

咨询内容：
${data.message}

=====================================

提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Ho_Chi_Minh' })}

请尽快回复此咨询！
`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'SpaceBridge世越装饰 <noreply@spacebridge.com>',
      to: process.env.EMAIL_TO || 'renhuaimin88@qq.com',
      subject: `【新咨询】${data.name} - ${serviceType.zh} - ${new Date().toLocaleDateString('zh-CN')}`,
      text: textContent,
      html: htmlContent
    });
    console.log('✅ 咨询邮件发送成功');
  } catch (error) {
    console.error('❌ 邮件发送失败:', error);
    throw error;
  }
}

export default { sendConsultationEmail };
