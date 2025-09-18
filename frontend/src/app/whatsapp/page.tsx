'use client';

import { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Button, Chip, List, ListItem, ListItemIcon, ListItemText, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel } from '@mui/material';
import { WhatsApp, CheckCircle, Schedule, Send, Notifications, QrCode, Phone, Message, Settings, Security } from '@mui/icons-material';

export default function WhatsAppPage() {
  const [connected, setConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const whatsappTemplates = [
    {
      id: 1,
      name: 'Aprovação Urgente',
      message: '🔔 *UXFLOW Portal*\n\nNova aprovação urgente:\n👤 {{consultant_name}}\n⏰ {{hours}}h\n📋 {{project_name}}\n\n🔗 Aprovar: {{link}}',
      usage: 'Para projetos críticos ou horas extras',
      active: true
    },
    {
      id: 2,
      name: 'Aprovação Padrão',
      message: '📊 *UXFLOW Portal*\n\n{{consultant_name}} enviou {{hours}}h para aprovação.\n\nProjeto: {{project_name}}\nData: {{date}}\n\n✅ Aprovar: {{link}}',
      usage: 'Template padrão para aprovações normais',
      active: true
    },
    {
      id: 3,
      name: 'Timesheet Aprovado',
      message: '✅ *Aprovado!*\n\nSuas {{hours}}h foram aprovadas por {{manager_name}}.\n\nProjeto: {{project_name}}\nValor: R$ {{value}}\n\n🎉 Parabéns!',
      usage: 'Confirmação de aprovação para consultor',
      active: true
    },
    {
      id: 4,
      name: 'Lembrete Aprovação',
      message: '⏰ *Lembrete UXFLOW*\n\nVocê tem aprovações pendentes:\n\n{{pending_list}}\n\n⚠️ SLA: 24h para aprovação\n\n🔗 Portal: {{portal_link}}',
      usage: 'Lembrete automático após timeout',
      active: false
    }
  ];

  const features = [
    { icon: <Notifications color="success" />, title: 'Alertas Instantâneos', desc: 'Notificações em tempo real para aprovações urgentes' },
    { icon: <CheckCircle color="primary" />, title: 'Aprovação Rápida', desc: 'Responder diretamente pelo WhatsApp com comandos' },
    { icon: <Schedule color="warning" />, title: 'Escalação Automática', desc: 'Escala para próximo nível se não responder em 2h' },
    { icon: <Message color="info" />, title: 'Templates Personalizados', desc: 'Mensagens customizáveis para cada situação' },
    { icon: <Security color="error" />, title: 'Segurança Empresarial', desc: 'Integração segura com WhatsApp Business API' },
    { icon: <Phone color="success" />, title: 'Multi-dispositivo', desc: 'Funciona em celular, web e desktop' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        📱 Integração WhatsApp Business - UXFLOW
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <strong>🚀 Próxima Funcionalidade:</strong> Integração com WhatsApp Business API para notificações instantâneas e aprovações rápidas via mensagem.
      </Alert>

      {/* Connection Status */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ border: connected ? '2px solid #25d366' : '2px solid #e2e8f0' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <WhatsApp sx={{ fontSize: 40, mr: 2, color: '#25d366' }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Status da Conexão WhatsApp
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {connected ? 'Conectado e funcionando' : 'Aguardando configuração'}
                  </Typography>
                </Box>
                <Box ml="auto">
                  <Chip 
                    label={connected ? 'Conectado' : 'Desconectado'} 
                    color={connected ? 'success' : 'default'}
                    size="large"
                  />
                </Box>
              </Box>

              {!connected ? (
                <Box>
                  <Typography variant="body1" mb={2}>
                    Para ativar a integração WhatsApp, você precisa:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Conta WhatsApp Business verificada" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="WhatsApp Business API configurada" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule color="warning" /></ListItemIcon>
                      <ListItemText primary="Webhook UXFLOW configurado" />
                    </ListItem>
                  </List>
                  
                  <Box display="flex" gap={2} mt={3}>
                    <Button 
                      variant="contained" 
                      startIcon={<QrCode />}
                      onClick={() => setShowQR(true)}
                      sx={{ bgcolor: '#25d366' }}
                    >
                      Conectar via QR Code
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Settings />}
                      sx={{ borderColor: '#25d366', color: '#25d366' }}
                    >
                      Configurar API
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" color="success.main" mb={2}>
                    ✅ WhatsApp Business conectado com sucesso!
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Button variant="outlined" onClick={() => setShowTemplates(true)}>
                      Gerenciar Templates
                    </Button>
                    <Button variant="outlined" color="error">
                      Desconectar
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                📊 Estatísticas WhatsApp
              </Typography>
              <Box mb={2}>
                <Typography variant="h4" fontWeight="bold">0</Typography>
                <Typography variant="body2">Mensagens Enviadas</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h4" fontWeight="bold">0%</Typography>
                <Typography variant="body2">Taxa de Entrega</Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">0s</Typography>
                <Typography variant="body2">Tempo Médio Resposta</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features Grid */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        🚀 Funcionalidades da Integração
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card sx={{ height: '100%', border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold" ml={2}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Templates Preview */}
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            📱 Templates de Mensagem
          </Typography>
          
          <Grid container spacing={2}>
            {whatsappTemplates.slice(0, 3).map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card sx={{ 
                  border: '1px solid #25d366',
                  opacity: template.active ? 1 : 0.6
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
                    
                    <Box sx={{ 
                      bgcolor: '#f0f9ff', 
                      p: 2, 
                      borderRadius: 2, 
                      border: '1px solid #25d366',
                      mb: 2
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.85rem',
                        whiteSpace: 'pre-line',
                        fontFamily: 'monospace'
                      }}>
                        {template.message}
                      </Typography>
                    </Box>
                    
                    <Button 
                      size="small" 
                      variant="outlined" 
                      fullWidth
                      sx={{ borderColor: '#25d366', color: '#25d366' }}
                    >
                      Testar Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={3}>
            <Button 
              variant="contained" 
              onClick={() => setShowTemplates(true)}
              sx={{ bgcolor: '#25d366' }}
            >
              Ver Todos os Templates
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={showQR} onClose={() => setShowQR(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            📱 Conectar WhatsApp Business
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={4}>
            <Box 
              sx={{ 
                width: 200, 
                height: 200, 
                bgcolor: '#f5f5f5', 
                border: '2px dashed #ccc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <QrCode sx={{ fontSize: 80, color: '#ccc' }} />
            </Box>
            
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Escaneie o QR Code
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              1. Abra o WhatsApp Business no seu celular<br/>
              2. Vá em Configurações → Dispositivos conectados<br/>
              3. Toque em "Conectar um dispositivo"<br/>
              4. Escaneie este QR Code
            </Typography>
            
            <Alert severity="info">
              <strong>Funcionalidade em Desenvolvimento:</strong> A integração WhatsApp estará disponível na próxima versão do portal.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQR(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Templates Modal */}
      <Dialog open={showTemplates} onClose={() => setShowTemplates(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            📱 Gerenciar Templates WhatsApp
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {whatsappTemplates.map((template) => (
              <Grid item xs={12} md={6} key={template.id}>
                <Card sx={{ border: '1px solid #25d366' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        {template.name}
                      </Typography>
                      <FormControlLabel
                        control={<Switch checked={template.active} />}
                        label={template.active ? 'Ativo' : 'Inativo'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {template.usage}
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={template.message}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    
                    <Box display="flex" gap={1}>
                      <Button size="small" variant="outlined" sx={{ borderColor: '#25d366', color: '#25d366' }}>
                        Salvar
                      </Button>
                      <Button size="small" variant="outlined" sx={{ borderColor: '#25d366', color: '#25d366' }}>
                        Testar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTemplates(false)}>Fechar</Button>
          <Button variant="contained" sx={{ bgcolor: '#25d366' }}>
            Salvar Todas as Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}