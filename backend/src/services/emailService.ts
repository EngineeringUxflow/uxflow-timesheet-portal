import sgMail from '@sendgrid/mail';
import { WorkflowService } from './workflowService';

// Configure SendGrid
const apiKey = process.env.SENDGRID_API_KEY || '';
if (apiKey && !apiKey.includes('demo_key')) {
  sgMail.setApiKey(apiKey);
}

interface TimesheetApprovalData {
  consultantName: string;
  consultantEmail: string;
  managerName: string;
  managerEmail: string;
  projectName: string;
  hours: number;
  date: string;
  activity: string;
  description: string;
  approvalLink: string;
}

export class EmailService {
  // Método principal que usa workflow service
  static async sendTimesheetApprovalWithWorkflow(timesheetData: any): Promise<boolean> {
    try {
      // Usa workflow service para determinar aprovador e template
      const approvalData = WorkflowService.createApprovalData(timesheetData);
      
      console.log('🔄 WORKFLOW ATIVADO:');
      console.log(`• Aprovador determinado: ${approvalData.managerName} (${approvalData.managerEmail})`);
      console.log(`• Template processado: ${approvalData.template.subject}`);
      
      return await this.sendTimesheetApproval(approvalData);
    } catch (error) {
      console.error('❌ Erro no workflow:', error);
      return false;
    }
  }
  
  static async sendTimesheetApproval(data: TimesheetApprovalData): Promise<boolean> {
    try {
      // Check if we have a real API key
      if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('sua_chave_real')) {
        console.log('📧 MODO DEMO - Simulando envio de email (API key não configurada)');
        console.log('══════════════════════════════════════');
        console.log('Para:', [data.managerEmail, 'comercial@uxflow.tech', 'vladimir.ribeiro.abreu@gmail.com']);
        console.log('De: UXFLOW Portal SAP <noreply@uxflow.tech>');
        console.log('Assunto:', `⏰ Nova Solicitação de Aprovação - ${data.consultantName}`);
        console.log('──────────────────────────────────────');
        console.log('📊 DETALHES DO TIMESHEET:');
        console.log(`• Consultor: ${data.consultantName}`);
        console.log(`• Projeto: ${data.projectName}`);
        console.log(`• Horas: ${data.hours}h`);
        console.log(`• Data: ${new Date(data.date).toLocaleDateString('pt-BR')}`);
        console.log(`• Atividade: ${data.activity}`);
        console.log(`• Valor: R$ ${(data.hours * 150).toLocaleString('pt-BR')}`);
        console.log(`• Descrição: ${data.description}`);
        console.log('──────────────────────────────────────');
        console.log('✅ Email simulado enviado com sucesso (DEMO)');
        console.log('📧 Para ativar envio real: Configure SENDGRID_API_KEY no .env');
        console.log('══════════════════════════════════════');
        return true;
      }
      
      // Real email sending
      const msg = {
        to: [
          data.managerEmail, // Email do aprovador específico
          'comercial@uxflow.tech', // Cópia para comercial
          'vladimir.ribeiro.abreu@gmail.com' // Cópia para Vladimir
        ],
        from: {
          email: 'noreply@uxflow.tech',
          name: 'UXFLOW Portal SAP'
        },
        subject: `⏰ Nova Solicitação de Aprovação - ${data.consultantName}`,
        html: this.getApprovalTemplate(data),
        text: this.getApprovalTextTemplate(data)
      };
      
      console.log('📧 ENVIANDO EMAIL REAL VIA SENDGRID...');
      console.log('Para:', msg.to);
      console.log('Assunto:', msg.subject);
      
      await sgMail.send(msg);
      console.log('✅ Email enviado com sucesso via SendGrid!');
      return true;
      
    } catch (error: any) {
      console.error('❌ Erro ao enviar email:', error);
      console.error('Detalhes:', {
        message: error.message,
        code: error.code,
        response: error.response?.body
      });
      return false;
    }
  }

  private static getApprovalTemplate(data: TimesheetApprovalData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Aprovação de Timesheet - UXFLOW</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🚀 UXFLOW Portal SAP</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Software Engineering & Cloud Solutions</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1a365d; margin-top: 0;">⏰ Nova Solicitação de Aprovação</h2>
        
        <p>Olá <strong>${data.managerName}</strong>,</p>
        
        <p>O consultor <strong>${data.consultantName}</strong> enviou <strong>${data.hours}h</strong> para aprovação no projeto <strong>${data.projectName}</strong>.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
          <h3 style="margin-top: 0; color: #1a365d;">📊 Detalhes do Timesheet:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 8px 0;"><strong>📅 Data:</strong> ${new Date(data.date).toLocaleDateString('pt-BR')}</li>
            <li style="margin: 8px 0;"><strong>⚡ Atividade:</strong> ${data.activity}</li>
            <li style="margin: 8px 0;"><strong>⏱️ Horas:</strong> ${data.hours}h</li>
            <li style="margin: 8px 0;"><strong>💰 Valor:</strong> R$ ${(data.hours * 150).toLocaleString('pt-BR')}</li>
            <li style="margin: 8px 0;"><strong>📝 Descrição:</strong> ${data.description}</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.approvalLink}" style="background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            ✅ APROVAR TIMESHEET
          </a>
        </div>
        
        <div style="background: #e6fffa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #234e52;">
            <strong>⚡ Ação Rápida:</strong> Clique no botão acima para aprovar instantaneamente ou acesse o portal para mais detalhes.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #718096; text-align: center;">
          Este email foi enviado automaticamente pelo <strong>UXFLOW Portal SAP</strong><br>
          © 2024 UXFLOW - Software Engineering & Cloud Solutions
        </p>
      </div>
    </body>
    </html>
    `;
  }

  private static getApprovalTextTemplate(data: TimesheetApprovalData): string {
    return `
UXFLOW Portal SAP - Nova Solicitação de Aprovação

Olá ${data.managerName},

O consultor ${data.consultantName} enviou ${data.hours}h para aprovação no projeto ${data.projectName}.

DETALHES DO TIMESHEET:
• Data: ${new Date(data.date).toLocaleDateString('pt-BR')}
• Atividade: ${data.activity}
• Horas: ${data.hours}h
• Valor: R$ ${(data.hours * 150).toLocaleString('pt-BR')}
• Descrição: ${data.description}

Para aprovar, acesse: ${data.approvalLink}

---
UXFLOW - Software Engineering & Cloud Solutions
© 2024 Todos os direitos reservados
    `;
  }
}