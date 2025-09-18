'use client';

import { Box, Container, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { AccessTime, Dashboard, Analytics, People, CloudQueue, Security, TrendingUp, Assignment } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #3182ce 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        opacity: 0.3
      }
    }}>
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2
            }}
          >
            UXFLOW SAP Timesheet
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#63b3ed',
              fontWeight: 600,
              mb: 2
            }}
          >
            Portal Especializado em Projetos SAP
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}>
            A primeira solução de timesheet desenvolvida especificamente para consultorias SAP, 
            com templates modernos e features avançadas de analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                borderRadius: 3, 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                boxShadow: '0 8px 25px rgba(56, 161, 105, 0.3)',
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(56, 161, 105, 0.4)'
                }
              }}
              onClick={() => router.push('/login')}
            >
              Acessar Portal
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                borderRadius: 3, 
                px: 4, 
                py: 1.5,
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
              onClick={() => router.push('/login')}
            >
              Ver Demonstração
            </Button>
          </Box>
        </Box>

        {/* Specialization Section */}
        <Card sx={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 4,
          p: 4,
          mb: 6,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            🏆 Especialização UXFLOW em Timesheet SAP
          </Typography>
          <Typography variant="h6" sx={{ color: '#63b3ed', mb: 3 }}>
            A única consultoria que desenvolveu um portal de timesheet especializado para projetos SAP
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Box sx={{ background: 'rgba(56, 161, 105, 0.2)', p: 2, borderRadius: 2, border: '1px solid rgba(56, 161, 105, 0.3)' }}>
                <Typography variant="h5" sx={{ color: '#38a169', fontWeight: 'bold' }}>95%</Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>Consultorias usam Excel</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ background: 'rgba(237, 137, 54, 0.2)', p: 2, borderRadius: 2, border: '1px solid rgba(237, 137, 54, 0.3)' }}>
                <Typography variant="h5" sx={{ color: '#ed8936', fontWeight: 'bold' }}>0</Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>Soluções SAP especializadas</Typography>
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ background: 'rgba(49, 130, 206, 0.2)', p: 2, borderRadius: 2, border: '1px solid rgba(49, 130, 206, 0.3)' }}>
                <Typography variant="h5" sx={{ color: '#3182ce', fontWeight: 'bold' }}>100%</Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>Foco em projetos SAP</Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Features Grid */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <AccessTime sx={{ fontSize: 48, color: '#1a365d', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                  Cronômetro em Tempo Real
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registre horas com cronômetro integrado ou formulário manual por tarefa/projeto SAP
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Assignment sx={{ fontSize: 48, color: '#3182ce', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                  Tarefas Pré-Definidas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lista de atividades alocadas por projeto, fase e módulo SAP (FI, CO, MM, SD, PP, BTP)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <Security sx={{ fontSize: 48, color: '#38a169', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                  Aprovação de Horas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workflow de aprovação com histórico completo: rascunho → pendente → aprovado/rejeitado
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center', 
              p: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 48, color: '#ed8936', mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                  Analytics de Rentabilidade
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cálculo automático de custos, margem de lucro e ROI por projeto SAP
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* CTA Section */}
        <Card sx={{ 
          background: 'rgba(255,255,255,0.1)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 4,
          p: 6,
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
            Revolucione seus Projetos SAP
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            Desenvolvido pela UXFLOW - Especialistas em SAP Cloud Solutions e Multi-Cloud Integration
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(56, 161, 105, 0.4)'
              }
            }}
            onClick={() => router.push('/login')}
          >
            Solicitar Demonstração
          </Button>
        </Card>
      </Container>
    </Box>
  );
}