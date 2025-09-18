import { Router } from 'express';
import { EmailService } from '../services/emailService';
import { WorkflowService } from '../services/workflowService';
import { DemoEmailService } from '../services/demoEmailService';
// import { authenticateToken } from '../middleware/auth';

// Simple auth check for demo
const authenticateToken = (req: any, res: any, next: any) => {
  // Skip auth for demo
  next();
};

const router = Router();

router.post('/send-approval', authenticateToken, async (req, res) => {
  try {
    const {
      consultantName,
      consultantEmail,
      managerName,
      managerEmail,
      projectName,
      hours,
      date,
      activity,
      description
    } = req.body;

    // Generate approval link
    const approvalLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/approve/${Date.now()}`;

    const emailData = {
      consultantName: consultantName || 'Demo UXFLOW',
      consultantEmail: consultantEmail || 'demo@uxflow.com',
      managerName: managerName || 'Equipe UXFLOW',
      managerEmail: managerEmail || 'comercial@uxflow.tech',
      projectName: projectName || 'SAP S/4HANA - Petrobras',
      hours: parseFloat(hours) || 8,
      date: date || new Date().toISOString(),
      activity: activity || 'DEVELOPMENT',
      description: description || 'Desenvolvimento de funcionalidades SAP',
      approvalLink
    };

    console.log('📧 Processando via WORKFLOW SERVICE...');
    const success = await EmailService.sendTimesheetApprovalWithWorkflow(emailData);
    
    // Determina aprovador baseado na hierarquia
    const approver = WorkflowService.getApproverForHours(emailData.hours);

    if (success) {
      res.json({
        success: true,
        message: '✅ Email enviado via workflow de aprovação!',
        mode: 'WORKFLOW_DEMO',
        workflow: {
          approver: {
            name: approver.name,
            role: approver.role,
            email: approver.email,
            level: approver.level
          },
          template: 'timesheet-approval',
          hierarchy_used: true
        },
        recipients: [
          approver.email,
          process.env.EMAIL_COMERCIAL || 'comercial@uxflow.tech',
          process.env.EMAIL_VLADIMIR || 'vladimir.ribeiro.abreu@gmail.com'
        ],
        approvalLink,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao processar envio de email'
      });
    }
  } catch (error) {
    console.error('❌ Erro na rota de email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Rota para email demo que realmente funciona
router.post('/send-demo', authenticateToken, async (req, res) => {
  try {
    const {
      consultantName = 'Demo UXFLOW',
      managerName = 'Vladimir Ribeiro',
      projectName = 'SAP S/4HANA - Petrobras',
      hours = 8,
      date = new Date().toISOString(),
      activity = 'DEVELOPMENT',
      description = 'Desenvolvimento de funcionalidades SAP para demonstração do portal'
    } = req.body;

    const value = (hours * 150).toLocaleString('pt-BR');

    console.log('📧 Processando envio de EMAIL DEMO REAL...');
    const success = await DemoEmailService.sendDemoEmail({
      consultantName,
      managerName,
      projectName,
      hours,
      date,
      activity,
      description,
      value
    });

    if (success) {
      res.json({
        success: true,
        message: '✅ EMAIL DEMO ENVIADO COM SUCESSO!',
        mode: 'DEMO_REAL_EMAIL',
        recipients: [
          'vladimir.ribeiro.abreu@gmail.com',
          'comercial@uxflow.tech'
        ],
        details: {
          service: 'Nodemailer + Gmail',
          template: 'HTML Profissional',
          delivery: 'Garantida'
        },
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao enviar email demo'
      });
    }
  } catch (error) {
    console.error('❌ Erro na rota de email demo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export default router;