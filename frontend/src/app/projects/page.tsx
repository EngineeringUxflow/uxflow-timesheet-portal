'use client';

import { Container, Typography, Grid, Card, CardContent, Box, Chip, LinearProgress, Avatar } from '@mui/material';
import { Business, CloudQueue, Analytics } from '@mui/icons-material';

export default function ProjectsPage() {
  const projects = [
    {
      name: 'SAP S/4HANA - Petrobras',
      module: 'FI • CO • MM',
      progress: 85,
      status: 'Em Andamento',
      cloud: 'AWS',
      budget: 'R$ 2.5M'
    },
    {
      name: 'BTP Integration - Vale',
      module: 'BTP • APIs • Cloud',
      progress: 92,
      status: 'Finalização',
      cloud: 'Azure',
      budget: 'R$ 1.8M'
    },
    {
      name: 'SAP Analytics - Embraer',
      module: 'BI • Analytics • ML',
      progress: 67,
      status: 'Desenvolvimento',
      cloud: 'GCP',
      budget: 'R$ 3.2M'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Projetos SAP - UXFLOW
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Business sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">12</Typography>
                  <Typography>Projetos Ativos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CloudQueue sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">3</Typography>
                  <Typography>Multi-Cloud</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Business sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">47</Typography>
                  <Typography>Integrações BTP</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Analytics sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">R$ 8.5M</Typography>
                  <Typography>Portfolio Total</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: '#3182ce', mr: 2 }}>
                    <Business />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.module}
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Progresso</Typography>
                    <Typography variant="body2">{project.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={project.status} 
                    color={project.progress > 90 ? 'success' : project.progress > 70 ? 'warning' : 'primary'}
                    size="small"
                  />
                  <Chip label={project.cloud} variant="outlined" size="small" />
                </Box>

                <Typography variant="h6" color="primary" fontWeight="bold">
                  {project.budget}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}