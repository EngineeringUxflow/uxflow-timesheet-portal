import { Router } from 'express';
import { EmailService } from '../services/emailService';

const router = Router();

router.post('/test-sendgrid', async (req, res) => {
  try {
    console.log('🧪 Testando configuração SendGrid...');
    
    // Verificar modo demo
    const isDemoMode = !process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('demo_key');
    
    if (isDemoMode) {
      console.log('🎭 Executando em MODO DEMO - Email será simulado');
    }

    // Dados de teste
    const testData = {
      consultantName: 'Teste UXFLOW',
      consultantEmail: 'teste@uxflow.com',
      managerName: 'Equipe UXFLOW',
      managerEmail: 'comercial@uxflow.tech',
      projectName: 'Teste SendGrid - Portal SAP',
      hours: 2,
      date: new Date().toISOString(),
      activity: 'TESTING',
      description: 'Teste de envio de email via SendGrid',
      approvalLink: `${process.env.FRONTEND_URL}/approve/test-${Date.now()}`
    };

    console.log('📧 Enviando email de teste...');
    const success = await EmailService.sendTimesheetApproval(testData);

    if (success) {
      res.json({
        success: true,
        message: isDemoMode ? '✅ Email simulado com sucesso (MODO DEMO)!' : '✅ Email de teste enviado com sucesso!',
        mode: isDemoMode ? 'DEMO' : 'REAL',
        recipients: [
          process.env.EMAIL_COMERCIAL || 'comercial@uxflow.tech',
          process.env.EMAIL_VLADIMIR || 'vladimir.ribeiro.abreu@gmail.com'
        ],
        testData
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Falha no envio do email de teste',
        message: 'Verifique os logs do servidor para mais detalhes'
      });
    }
  } catch (error) {
    console.error('❌ Erro no teste de email:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno no teste de email',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

router.get('/sendgrid-status', (req, res) => {
  const hasRealApiKey = !!(process.env.SENDGRID_API_KEY && !process.env.SENDGRID_API_KEY.includes('demo_key'));
  const isDemoMode = !hasRealApiKey;
  
  res.json({
    configured: !!process.env.SENDGRID_API_KEY,
    mode: isDemoMode ? 'DEMO' : 'REAL',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@uxflow.tech',
    fromName: process.env.SENDGRID_FROM_NAME || 'UXFLOW Portal SAP',
    recipients: [
      process.env.EMAIL_COMERCIAL || 'comercial@uxflow.tech',
      process.env.EMAIL_VLADIMIR || 'vladimir.ribeiro.abreu@gmail.com'
    ],
    apiKeyStatus: hasApiKey ? '✅ Configurada' : '❌ Chave demo/não configurada'
  });
});

export default router;