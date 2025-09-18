'use client';

import { Container, Typography, Grid, Card, CardContent, Box, Chip, Button, Divider } from '@mui/material';
import { TrendingUp, Assessment, Speed, Notifications, GetApp, PictureAsPdf, TableChart, PowerSettingsNew } from '@mui/icons-material';

export default function AnalyticsPage() {
  const exportToPDF = () => {
    alert('📄 Exportando dashboard para PDF...\n📊 Relatório Analytics SAP gerado com sucesso!');
  };
  
  const exportToExcel = () => {
    alert('📈 Exportando dados para Excel...\n📊 Planilha Analytics SAP.xlsx baixada!');
  };
  
  const connectPowerBI = () => {
    alert('🔌 Conectando ao Power BI...\n📊 Dashboard sincronizado com Power BI Online!');
  };
  
  const connectPowerAutomate = () => {
    alert('⚡ Conectando ao Power Automate...\n🤖 Fluxos de automação configurados!');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Analytics SAP Avançados - UXFLOW
        </Typography>
        
        <Box display="flex" gap={1}>
          <Button 
            variant="outlined" 
            startIcon={<PictureAsPdf />}
            onClick={exportToPDF}
            sx={{ borderColor: '#e53e3e', color: '#e53e3e' }}
          >
            PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<TableChart />}
            onClick={exportToExcel}
            sx={{ borderColor: '#38a169', color: '#38a169' }}
          >
            Excel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PowerSettingsNew />}
            onClick={connectPowerBI}
            sx={{ bgcolor: '#f2c811', color: 'black', '&:hover': { bgcolor: '#d4a017' } }}
          >
            Power BI
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Speed />}
            onClick={connectPowerAutomate}
            sx={{ bgcolor: '#0078d4', '&:hover': { bgcolor: '#106ebe' } }}
          >
            Power Automate
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  ROI em Tempo Real
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                247%
              </Typography>
              <Typography>Retorno sobre investimento em projetos SAP</Typography>
              <Chip label="↗ +23% este mês" color="success" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Eficiência Projetos
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                94.2%
              </Typography>
              <Typography>Taxa de entrega no prazo</Typography>
              <Chip label="FI • CO • MM • SD" color="primary" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Speed sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Performance BTP
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                1.2s
              </Typography>
              <Typography>Tempo médio de resposta APIs</Typography>
              <Chip label="AWS • Azure • GCP" color="warning" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Automação Workflow
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" mb={1}>
                98.7%
              </Typography>
              <Typography>Aprovações automáticas processadas</Typography>
              <Chip label="Email + WhatsApp" color="secondary" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Power Platform Integration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            🔌 Integração Microsoft Power Platform
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ border: '2px solid #f2c811' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PowerSettingsNew sx={{ fontSize: 40, mr: 2, color: '#f2c811' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Power BI Templates
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" mb={2}>
                    Templates pré-configurados para dashboards SAP:
                  </Typography>
                  
                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <Chip label="📈 ROI por Projeto SAP" size="small" variant="outlined" />
                    <Chip label="⏰ Produtividade Consultores" size="small" variant="outlined" />
                    <Chip label="💰 Análise Custos BTP" size="small" variant="outlined" />
                    <Chip label="🏆 KPIs Executivos" size="small" variant="outlined" />
                  </Box>
                  
                  <Button variant="outlined" fullWidth sx={{ borderColor: '#f2c811', color: '#f2c811' }}>
                    Baixar Templates .pbix
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ border: '2px solid #0078d4' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Speed sx={{ fontSize: 40, mr: 2, color: '#0078d4' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Power Automate Flows
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" mb={2}>
                    Fluxos de automação pré-configurados:
                  </Typography>
                  
                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <Chip label="📧 Relatórios Automáticos" size="small" variant="outlined" />
                    <Chip label="🔔 Alertas de Performance" size="small" variant="outlined" />
                    <Chip label="📄 Backup de Dados" size="small" variant="outlined" />
                    <Chip label="📊 Sync com SharePoint" size="small" variant="outlined" />
                  </Box>
                  
                  <Button variant="outlined" fullWidth sx={{ borderColor: '#0078d4', color: '#0078d4' }}>
                    Importar Flows .zip
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}