interface ApprovalHierarchy {
  level: number;
  role: string;
  name: string;
  email: string;
  hourLimit: number;
  autoApprove: boolean;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
}

export class WorkflowService {
  // Hierarquia de aprovação baseada na página workflows
  private static approvalHierarchy: ApprovalHierarchy[] = [
    { level: 1, role: 'Consultor', name: 'Carlos Silva', email: 'carlos@uxflow.tech', hourLimit: 8, autoApprove: false },
    { level: 2, role: 'Coordenador', name: 'Ana Costa', email: 'ana@uxflow.tech', hourLimit: 40, autoApprove: false },
    { level: 3, role: 'Gerente', name: 'Roberto Santos', email: 'roberto@uxflow.tech', hourLimit: 160, autoApprove: false },
    { level: 4, role: 'Diretor', name: 'Vladimir Ribeiro', email: 'vladimir.ribeiro.abreu@gmail.com', hourLimit: 999, autoApprove: false }
  ];

  // Templates configurados na página workflows
  private static emailTemplates: WorkflowTemplate[] = [
    {
      id: 'timesheet-approval',
      name: 'Aprovação Timesheet',
      subject: '⏰ Nova Solicitação de Aprovação - {{consultant_name}}',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #3182ce 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚀 UXFLOW Portal SAP</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Software Engineering & Cloud Solutions</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1a365d; margin-top: 0;">⏰ Nova Solicitação de Aprovação</h2>
            
            <p>Olá <strong>{{manager_name}}</strong>,</p>
            
            <p>O consultor <strong>{{consultant_name}}</strong> enviou <strong>{{hours}}h</strong> para aprovação no projeto <strong>{{project_name}}</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3182ce;">
              <h3 style="margin-top: 0; color: #1a365d;">📊 Detalhes do Timesheet:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin: 8px 0;"><strong>📅 Data:</strong> {{date}}</li>
                <li style="margin: 8px 0;"><strong>⚡ Atividade:</strong> {{activity}}</li>
                <li style="margin: 8px 0;"><strong>⏱️ Horas:</strong> {{hours}}h</li>
                <li style="margin: 8px 0;"><strong>💰 Valor:</strong> R$ {{value}}</li>
                <li style="margin: 8px 0;"><strong>📝 Descrição:</strong> {{description}}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{approval_link}}" style="background: linear-gradient(135deg, #38a169 0%, #2f855a 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                ✅ APROVAR TIMESHEET
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #718096; text-align: center;">
              Este email foi enviado automaticamente pelo <strong>UXFLOW Portal SAP</strong><br>
              © 2024 UXFLOW - Software Engineering & Cloud Solutions
            </p>
          </div>
        </div>
      `,
      textBody: `
UXFLOW Portal SAP - Nova Solicitação de Aprovação

Olá {{manager_name}},

O consultor {{consultant_name}} enviou {{hours}}h para aprovação no projeto {{project_name}}.

DETALHES DO TIMESHEET:
• Data: {{date}}
• Atividade: {{activity}}
• Horas: {{hours}}h
• Valor: R$ {{value}}
• Descrição: {{description}}

Para aprovar, acesse: {{approval_link}}

---
UXFLOW - Software Engineering & Cloud Solutions
© 2024 Todos os direitos reservados
      `,
      variables: ['consultant_name', 'manager_name', 'project_name', 'hours', 'date', 'activity', 'value', 'description', 'approval_link']
    }
  ];

  // Determina aprovador baseado nas horas e hierarquia
  static getApproverForHours(hours: number): ApprovalHierarchy {
    // Encontra o primeiro nível que pode aprovar essas horas
    const approver = this.approvalHierarchy.find(level => hours <= level.hourLimit);
    
    // Se não encontrar, usa o último nível (diretor)
    return approver || this.approvalHierarchy[this.approvalHierarchy.length - 1];
  }

  // Processa template com variáveis
  static processTemplate(templateId: string, variables: Record<string, any>): { subject: string; htmlBody: string; textBody: string } {
    const template = this.emailTemplates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} não encontrado`);
    }

    let subject = template.subject;
    let htmlBody = template.htmlBody;
    let textBody = template.textBody;

    // Substitui variáveis
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      htmlBody = htmlBody.replace(new RegExp(placeholder, 'g'), String(value));
      textBody = textBody.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return { subject, htmlBody, textBody };
  }

  // Cria dados para aprovação baseado no timesheet
  static createApprovalData(timesheetData: any) {
    const approver = this.getApproverForHours(timesheetData.hours);
    
    const variables = {
      consultant_name: timesheetData.consultantName || 'Demo UXFLOW',
      manager_name: approver.name,
      project_name: timesheetData.projectName || 'SAP S/4HANA - Petrobras',
      hours: timesheetData.hours,
      date: new Date(timesheetData.date).toLocaleDateString('pt-BR'),
      activity: timesheetData.activity,
      value: (timesheetData.hours * 150).toLocaleString('pt-BR'),
      description: timesheetData.description,
      approval_link: `${process.env.FRONTEND_URL}/approval/${timesheetData.id || 'demo-123'}`
    };

    const processedTemplate = this.processTemplate('timesheet-approval', variables);

    return {
      consultantName: variables.consultant_name,
      consultantEmail: timesheetData.consultantEmail || 'demo@uxflow.com',
      managerName: approver.name,
      managerEmail: approver.email,
      projectName: variables.project_name,
      hours: timesheetData.hours,
      date: timesheetData.date,
      activity: timesheetData.activity,
      description: timesheetData.description,
      approvalLink: variables.approval_link,
      template: processedTemplate
    };
  }

  // Lista todos os aprovadores
  static getApprovalHierarchy(): ApprovalHierarchy[] {
    return this.approvalHierarchy;
  }

  // Lista todos os templates
  static getEmailTemplates(): WorkflowTemplate[] {
    return this.emailTemplates;
  }
}