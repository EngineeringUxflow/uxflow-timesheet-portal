'use client';

import { Box, Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { AccessTime, Dashboard, Analytics, People, CloudQueue, Security, TrendingUp, Assignment } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 3rem)',
      background: '#fafafa',
      position: 'relative'
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Card className="sap-card" sx={{ mb: 4, p: 4, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 300,
              color: '#32363a',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2
            }}
          >
            UXFLOW SAP Timesheet Portal
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#0070f2',
              fontWeight: 400,
              mb: 2
            }}
          >
            Portal Especializado em Projetos SAP
          </Typography>
          <Typography variant="body1" sx={{ color: '#6a6d70', mb: 4, maxWidth: 600, mx: 'auto' }}>
            A primeira solução de timesheet desenvolvida especificamente para consultorias SAP, 
            seguindo os padrões do SAP Fiori Design System
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              className="sap-btn sap-btn-primary"
              onClick={() => router.push('/login')}
            >
              Acessar Portal
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              className="sap-btn sap-btn-secondary"
              onClick={() => router.push('/login')}
            >
              Ver Demonstração
            </Button>
          </Box>
        </Card>

        {/* Specialization Section */}
        <Card className="sap-card" sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <div className="sap-card-header">
            <Typography variant="h4" className="sap-card-title">
              🏆 Especialização UXFLOW em Timesheet SAP
            </Typography>
            <Typography variant="body1" className="sap-card-subtitle">
              A única consultoria que desenvolveu um portal de timesheet especializado para projetos SAP
            </Typography>
          </div>
          <div className="sap-card-content">
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#30914c', fontWeight: 300, mb: 1 }}>95%</Typography>
                  <Typography variant="body2" sx={{ color: '#6a6d70' }}>Consultorias usam Excel</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#ff8c00', fontWeight: 300, mb: 1 }}>0</Typography>
                  <Typography variant="body2" sx={{ color: '#6a6d70' }}>Soluções SAP especializadas</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#0070f2', fontWeight: 300, mb: 1 }}>100%</Typography>
                  <Typography variant="body2" sx={{ color: '#6a6d70' }}>Foco em projetos SAP</Typography>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Card>

        {/* Features Grid */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card className="sap-card" sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <AccessTime sx={{ fontSize: 48, color: '#0070f2', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#32363a', fontWeight: 500 }}>
                  Cronômetro em Tempo Real
                </Typography>
                <Typography variant="body2" sx={{ color: '#6a6d70' }}>
                  Registre horas com cronômetro integrado ou formulário manual por tarefa/projeto SAP
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card className="sap-card" sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Assignment sx={{ fontSize: 48, color: '#30914c', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#32363a', fontWeight: 500 }}>
                  Tarefas Pré-Definidas
                </Typography>
                <Typography variant="body2" sx={{ color: '#6a6d70' }}>
                  Lista de atividades alocadas por projeto, fase e módulo SAP (FI, CO, MM, SD, PP, BTP)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card className="sap-card" sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Security sx={{ fontSize: 48, color: '#f9b500', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#32363a', fontWeight: 500 }}>
                  Aprovação de Horas
                </Typography>
                <Typography variant="body2" sx={{ color: '#6a6d70' }}>
                  Workflow de aprovação com histórico completo: rascunho → pendente → aprovado/rejeitado
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card className="sap-card" sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <TrendingUp sx={{ fontSize: 48, color: '#bb0000', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#32363a', fontWeight: 500 }}>
                  Analytics de Rentabilidade
                </Typography>
                <Typography variant="body2" sx={{ color: '#6a6d70' }}>
                  Cálculo automático de custos, margem de lucro e ROI por projeto SAP
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Card className="sap-card" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#32363a', fontWeight: 300 }}>
            Revolucione seus Projetos SAP
          </Typography>
          <Typography variant="body1" sx={{ color: '#6a6d70', mb: 4 }}>
            Desenvolvido pela UXFLOW - Especialistas em SAP Cloud Solutions e Multi-Cloud Integration
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            className="sap-btn sap-btn-primary"
            onClick={() => router.push('/login')}
          >
            Solicitar Demonstração
          </Button>
        </Card>
      </Container>
    </Box>
  );
}