'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Chip, List, ListItem, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, TextField } from '@mui/material';
import { Email, CheckCircle, Schedule, Send, Person, PlayArrow, Edit, Visibility, Settings, Timeline, Assessment } from '@mui/icons-material';

export default function WorkflowsPage() {
  const [demoRunning, setDemoRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const emailTemplates = [
    {
      id: 1,
      name: 'Aprovação Timesheet',
      subject: '⏰ Nova Solicitação de Aprovação - {{consultant_name}}',
      body: 'Olá {{manager_name}},\\n\\nO consultor {{consultant_name}} enviou {{hours}}h para aprovação no projeto {{project_name}}.\\n\\n📊 Detalhes:\\n• Data: {{date}}\\n• Atividade: {{activity}}\\n• Descrição: {{description}}\\n\\n🔗 Aprovar: {{approval_link}}\\n\\nUXFLOW Portal SAP',
      usage: 'Notificação para managers quando timesheet é submetido',
      active: true
    },
    {
      id: 2,
      name: 'Timesheet Aprovado',
      subject: '✅ Timesheet Aprovado - {{project_name}}',
      body: 'Parabéns {{consultant_name}}!\\n\\nSuas {{hours}}h do projeto {{project_name}} foram aprovadas por {{manager_name}}.\\n\\n📈 Status: APROVADO\\n📅 Data: {{date}}\\n💰 Valor: R$ {{value}}\\n\\nUXFLOW Portal SAP',
      usage: 'Confirmação para consultor quando timesheet é aprovado',
      active: true
    },
    {
      id: 3,
      name: 'Lembrete Aprovação',
      subject: '🔔 Lembrete: Aprovação Pendente há {{hours_pending}}h',
      body: 'Olá {{manager_name}},\\n\\nVocê tem aprovações pendentes:\\n\\n{{pending_list}}\\n\\n⚠️ SLA: Aprovações devem ser feitas em até 24h\\n\\n🔗 Portal: {{portal_link}}\\n\\nUXFLOW Portal SAP',
      usage: 'Lembrete automático após 24h sem aprovação',
      active: false
    },
    {
      id: 4,
      name: 'Escalação Automática',
      subject: '⚠️ Escalação: Aprovação Pendente - {{consultant_name}}',
      body: 'Olá {{escalation_manager}},\\n\\nUma aprovação foi escalada para você:\\n\\nConsultor: {{consultant_name}}\\nProjeto: {{project_name}}\\nHoras: {{hours}}h\\nTempo pendente: {{pending_time}}\\n\\n🔗 Aprovar: {{approval_link}}\\n\\nUXFLOW Portal SAP',
      usage: 'Escalação para nível superior após timeout',
      active: true
    }
  ];
  
  const approvalHierarchy = [
    { level: 1, role: 'Coordenador', name: 'Ana Costa', hours: '≤ 40h', email: 'ana@uxflow.tech', auto: false },
    { level: 2, role: 'Gerente', name: 'Roberto Santos', hours: '≤ 160h', email: 'roberto@uxflow.tech', auto: false },
    { level: 3, role: 'Diretor', name: 'Vladimir Ribeiro', hours: '> 160h', email: 'vladimir.ribeiro.abreu@gmail.com', auto: false },
    { level: 4, role: 'CEO', name: 'Equipe Comercial', hours: 'Ilimitado', email: 'comercial@uxflow.tech', auto: true }
  ];

  const [workflowSteps, setWorkflowSteps] = useState([
    { id: 1, action: 'Timesheet Submetido', user: 'Demo UXFLOW', status: 'completed', time: '14:30' },
    { id: 2, action: 'Email Enviado', user: 'vladimir.ribeiro.abreu@gmail.com', status: 'completed', time: '14:31' },
    { id: 3, action: 'Aprovador Determinado', user: 'Ana Costa (Coordenador)', status: 'completed', time: '14:31' },
    { id: 4, action: 'Aguardando Aprovação', user: 'Ana Costa', status: 'pending', time: '-' },
    { id: 5, action: 'Notificação Final', user: 'Demo UXFLOW', status: 'waiting', time: '-' }
  ]);

  const startDemo = () => {
    setDemoRunning(true);
    setCurrentStep(0);
    
    // Reset workflow
    setWorkflowSteps(prev => prev.map(step => ({
      ...step,
      status: step.id <= 3 ? 'completed' : step.id === 4 ? 'pending' : 'waiting'
    })));

    // Simulate approval after 3 seconds
    setTimeout(() => {
      setWorkflowSteps(prev => prev.map(step => 
        step.id === 4 ? { ...step, status: 'completed', time: '14:35' } : step
      ));
      setCurrentStep(4);
      
      // Final notification
      setTimeout(() => {
        setWorkflowSteps(prev => prev.map(step => 
          step.id === 5 ? { ...step, status: 'completed', time: '14:36' } : step
        ));
        setCurrentStep(5);
        setDemoRunning(false);
      }, 2000);
    }, 3000);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        📋 Workflows de Aprovação - UXFLOW
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <strong>🔄 Sistema Inteligente:</strong> Workflows automatizados com hierarquia dinâmica baseada em horas trabalhadas e templates de email personalizáveis.
      </Alert>

      <Grid container spacing={3}>
        {/* Email Workflow Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ border: '2px solid #3182ce', height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Email sx={{ fontSize: 40, mr: 2, color: '#3182ce' }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Workflow de Email Automatizado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sistema inteligente de notificações por email
                  </Typography>
                </Box>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText 
                    primary="Timesheet Submetido" 
                    secondary="Notifica aprovador automaticamente baseado na hierarquia" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Person color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Aprovador Inteligente" 
                    secondary="Determina aprovador baseado em horas: ≤40h → Coordenador, ≤160h → Gerente" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Schedule color="warning" /></ListItemIcon>
                  <ListItemText 
                    primary="Lembretes Automáticos" 
                    secondary="Lembrete após 24h + escalação automática após 48h" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Send color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Feedback Instantâneo" 
                    secondary="Consultor recebe confirmação imediata da aprovação/rejeição" 
                  />
                </ListItem>
              </List>

              <Box display="flex" gap={2} mt={3}>
                <Button 
                  variant="contained" 
                  onClick={() => setShowTemplates(true)}
                  startIcon={<Settings />}
                  sx={{ flex: 1 }}
                >
                  Configurar Templates
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={startDemo}
                  disabled={demoRunning}
                  startIcon={<PlayArrow />}
                  sx={{ flex: 1 }}
                >
                  {demoRunning ? 'Executando...' : 'Testar Workflow'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Assessment sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">98%</Typography>
                      <Typography>Taxa de Aprovação</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Timeline sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">2.3h</Typography>
                      <Typography>Tempo Médio</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">1.2k</Typography>
                      <Typography>Emails Enviados</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Approval Hierarchy */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                🏢 Hierarquia de Aprovação Inteligente
              </Typography>
              
              <Alert severity="success" sx={{ mb: 3 }}>
                <strong>🎯 Sistema Automático:</strong> O aprovador é determinado automaticamente baseado na quantidade de horas registradas.
              </Alert>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Nível</strong></TableCell>
                      <TableCell><strong>Cargo</strong></TableCell>
                      <TableCell><strong>Responsável</strong></TableCell>
                      <TableCell><strong>Limite de Horas</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvalHierarchy.map((level) => (
                      <TableRow key={level.level}>
                        <TableCell>
                          <Avatar sx={{ bgcolor: '#3182ce', width: 32, height: 32 }}>
                            {level.level}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {level.role}
                          </Typography>
                        </TableCell>
                        <TableCell>{level.name}</TableCell>
                        <TableCell>
                          <Chip label={level.hours} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {level.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={level.auto ? 'Auto' : 'Manual'} 
                            size="small" 
                            color={level.auto ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Real-time Demo */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                  🚀 Demonstração de Workflow em Tempo Real
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<PlayArrow />}
                  onClick={startDemo}
                  disabled={demoRunning}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  {demoRunning ? 'Executando...' : 'Iniciar Demo'}
                </Button>
              </Box>
              
              <TableContainer sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Etapa</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ação</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuário/Destino</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Horário</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workflowSteps.map((step) => (
                      <TableRow key={step.id}>
                        <TableCell sx={{ color: 'white' }}>{step.id}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <Typography variant="subtitle2">{step.action}</Typography>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{step.user}</TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              step.status === 'completed' ? '✅ Concluído' :
                              step.status === 'pending' ? '⏳ Pendente' : '⏸️ Aguardando'
                            }
                            size="small"
                            color={
                              step.status === 'completed' ? 'success' :
                              step.status === 'pending' ? 'warning' : 'default'
                            }
                          />
                          {step.status === 'pending' && demoRunning && (
                            <LinearProgress sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                          )}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{step.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Templates Configuration Modal */}
      <Dialog open={showTemplates} onClose={() => setShowTemplates(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            📧 Configurar Templates de Email
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            📧 Templates de Email Configuráveis
          </Typography>
          
          <Grid container spacing={2} mb={4}>
            {emailTemplates.map((template) => (
              <Grid item xs={12} md={6} key={template.id}>
                <Card sx={{ 
                  height: '100%', 
                  border: template.active ? '2px solid #3182ce' : '1px solid #e2e8f0',
                  opacity: template.active ? 1 : 0.7
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {template.name}
                      </Typography>
                      <Chip 
                        label={template.active ? 'Ativo' : 'Inativo'} 
                        size="small" 
                        color={template.active ? 'success' : 'default'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {template.usage}
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" fontWeight="bold">Assunto:</Typography>
                      <Typography variant="body2" sx={{ 
                        bgcolor: '#f7fafc', 
                        p: 1, 
                        borderRadius: 1, 
                        fontSize: '0.85rem',
                        fontFamily: 'monospace'
                      }}>
                        {template.subject}
                      </Typography>
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" fontWeight="bold">Corpo:</Typography>
                      <Typography variant="body2" sx={{ 
                        bgcolor: '#f7fafc', 
                        p: 1, 
                        borderRadius: 1, 
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-line',
                        maxHeight: 120,
                        overflow: 'auto'
                      }}>
                        {template.body}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1}>
                      <Button size="small" startIcon={<Edit />} variant="outlined">
                        Editar
                      </Button>
                      <Button size="small" startIcon={<Visibility />} variant="outlined">
                        Preview
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Card sx={{ mt: 3, bgcolor: '#f7fafc', border: '1px solid #3182ce' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                🎨 Variáveis Disponíveis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>Consultor:</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip label="{{consultant_name}}" size="small" />
                    <Chip label="{{consultant_email}}" size="small" />
                  </Box>
                  
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>Projeto:</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip label="{{project_name}}" size="small" />
                    <Chip label="{{client_name}}" size="small" />
                    <Chip label="{{project_code}}" size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>Timesheet:</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip label="{{hours}}" size="small" />
                    <Chip label="{{date}}" size="small" />
                    <Chip label="{{activity}}" size="small" />
                    <Chip label="{{description}}" size="small" />
                    <Chip label="{{value}}" size="small" />
                  </Box>
                  
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>Manager:</Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip label="{{manager_name}}" size="small" />
                    <Chip label="{{approval_link}}" size="small" />
                    <Chip label="{{portal_link}}" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplates(false)}>Fechar</Button>
          <Button variant="contained">Salvar Configurações</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}