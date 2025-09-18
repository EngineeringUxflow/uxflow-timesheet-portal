import * as nodemailer from 'nodemailer';

interface DemoEmailData {
  consultantName: string;
  managerName: string;
  projectName: string;
  hours: number;
  date: string;
  activity: string;
  description: string;
  value: string;
}

export class DemoEmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vladimir.ribeiro.abreu@gmail.com',
      pass: 'grtl waze ulit oeee' // App password do Gmail
    }
  });

  static async sendDemoEmail(data: DemoEmailData): Promise<boolean> {
    try {
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Aprovação Timesheet - UXFLOW DEMO</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🚀 UXFLOW Portal SAP</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Software Engineering & Cloud Solutions</p>
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin-top: 15px;">
              <strong style="color: #ffd700;">⚡ DEMONSTRAÇÃO FUNCIONAL ⚡</strong>
            </div>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <h2 style="color: #1a365d; margin-top: 0; font-size: 24px;">⏰ Nova Solicitação de Aprovação</h2>
            
            <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #3182ce;">
              <p style="margin: 0; font-size: 16px;">
                Olá <strong style="color: #1a365d;">${data.managerName}</strong>,
              </p>
              <p style="margin: 10px 0 0 0; font-size: 16px;">
                O consultor <strong style="color: #3182ce;">${data.consultantName}</strong> enviou 
                <strong style="color: #e53e3e; font-size: 18px;">${data.hours}h</strong> para aprovação no projeto 
                <strong style="color: #1a365d;">${data.projectName}</strong>.
              </p>
            </div>
            
            <!-- Timesheet Details -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border: 2px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #1a365d; font-size: 20px;">📊 Detalhes do Timesheet:</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #4a5568;">📅 Data:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="background: #3182ce; color: white; padding: 4px 12px; border-radius: 15px; font-size: 14px;">
                      ${new Date(data.date).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #4a5568;">⚡ Atividade:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="background: #38a169; color: white; padding: 4px 12px; border-radius: 15px; font-size: 14px;">
                      ${data.activity}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #4a5568;">⏱️ Horas Trabalhadas:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                    <span style="background: #ed8936; color: white; padding: 4px 12px; border-radius: 15px; font-size: 16px; font-weight: bold;">
                      ${data.hours}h
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <strong style="color: #4a5568;">💰 Valor Estimado:</strong>
                  </td>
                  <td style="padding: 12px 0; text-align: right;">
                    <span style="background: #9f7aea; color: white; padding: 6px 15px; border-radius: 15px; font-size: 18px; font-weight: bold;">
                      R$ ${data.value}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Description -->
            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e53e3e;">
              <h4 style="margin-top: 0; color: #1a365d;">📝 Descrição das Atividades:</h4>
              <p style="margin: 0; font-style: italic; color: #4a5568; line-height: 1.6;">
                "${data.description}"
              </p>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="http://localhost:3000/dashboard" 
                 style="background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); 
                        color: white; 
                        padding: 18px 40px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(56, 161, 105, 0.3);
                        transition: all 0.3s ease;">
                ✅ APROVAR TIMESHEET
              </a>
            </div>
            
            <!-- Demo Notice -->
            <div style="background: #ffd700; color: #1a365d; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center; border: 2px solid #f6ad55;">
              <h3 style="margin: 0 0 10px 0;">🎯 DEMONSTRAÇÃO UXFLOW</h3>
              <p style="margin: 0; font-weight: bold;">
                Este é um email de demonstração do Portal SAP Timesheet da UXFLOW.<br>
                Sistema totalmente funcional para gestão de horas em projetos SAP.
              </p>
            </div>
            
            <!-- Footer -->
            <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 40px 0;">
            
            <div style="text-align: center; color: #718096;">
              <p style="margin: 0; font-size: 14px;">
                <strong>UXFLOW - Software Engineering & Cloud Solutions</strong><br>
                Portal SAP Timesheet | Gestão Inteligente de Horas<br>
                📧 comercial@uxflow.tech | 📱 WhatsApp: +55 11 99999-9999
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
                © 2024 UXFLOW Consultoria - Todos os direitos reservados
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: '"UXFLOW Portal SAP" <vladimir.ribeiro.abreu@gmail.com>',
        to: [
          'vladimir.ribeiro.abreu@gmail.com',
          'comercial@uxflow.tech'
        ],
        subject: `⏰ [DEMO] Nova Solicitação de Aprovação - ${data.consultantName}`,
        html: htmlTemplate,
        text: `
UXFLOW Portal SAP - DEMONSTRAÇÃO

Nova Solicitação de Aprovação

Consultor: ${data.consultantName}
Manager: ${data.managerName}
Projeto: ${data.projectName}
Horas: ${data.hours}h
Data: ${new Date(data.date).toLocaleDateString('pt-BR')}
Atividade: ${data.activity}
Valor: R$ ${data.value}
Descrição: ${data.description}

Para aprovar, acesse: http://localhost:3000/dashboard

---
UXFLOW - Software Engineering & Cloud Solutions
Este é um email de demonstração do sistema.
        `
      };

      console.log('📧 ENVIANDO EMAIL DEMO VIA NODEMAILER...');
      console.log('Para:', mailOptions.to);
      console.log('Assunto:', mailOptions.subject);

      await this.transporter.sendMail(mailOptions);
      
      console.log('✅ EMAIL DEMO ENVIADO COM SUCESSO!');
      return true;

    } catch (error) {
      console.error('❌ Erro ao enviar email demo:', error);
      return false;
    }
  }
}