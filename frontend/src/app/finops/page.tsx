'use client';

import { Container, Typography, Grid, Card, CardContent, Box, Chip, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CloudQueue, TrendingDown, Warning, CheckCircle, AttachMoney } from '@mui/icons-material';

export default function FinOpsPage() {
  const projects = [
    {
      name: 'SAP S/4HANA - Petrobras',
      btpCost: 2847.50,
      budget: 5000,
      usage: 57,
      services: ['Integration Suite', 'Analytics Cloud', 'HANA Cloud'],
      status: 'Otimizado',
      savings: 1247.30
    },
    {
      name: 'BTP Integration - Vale',
      btpCost: 4125.80,
      budget: 4500,
      usage: 92,
      services: ['Process Automation', 'API Management', 'Data Intelligence'],
      status: 'Atenção',
      savings: 0
    },
    {
      name: 'SAP Analytics - Embraer',
      btpCost: 1890.25,
      budget: 3000,
      usage: 63,
      services: ['Analytics Cloud', 'HANA Cloud', 'Mobile Services'],
      status: 'Otimizado',
      savings: 890.75
    }
  ];

  const totalCost = projects.reduce((acc, p) => acc + p.btpCost, 0);
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSavings = projects.reduce((acc, p) => acc + p.savings, 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        FinOps BTP - Controle de Custos Cloud
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CloudQueue sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ${totalCost.toLocaleString()}
                  </Typography>
                  <Typography>Custo Total BTP</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingDown sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ${totalSavings.toLocaleString()}
                  </Typography>
                  <Typography>Economia Gerada</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {Math.round((totalCost / totalBudget) * 100)}%
                  </Typography>
                  <Typography>Uso do Orçamento</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">23</Typography>
                  <Typography>Serviços Ativos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Projetos BTP - Análise de Custos
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Projeto</strong></TableCell>
                  <TableCell><strong>Custo BTP</strong></TableCell>
                  <TableCell><strong>Orçamento</strong></TableCell>
                  <TableCell><strong>Uso %</strong></TableCell>
                  <TableCell><strong>Serviços</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Economia</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {project.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        ${project.btpCost.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>${project.budget.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.usage} 
                          sx={{ width: 60, height: 8, borderRadius: 4 }}
                          color={project.usage > 90 ? 'error' : project.usage > 70 ? 'warning' : 'success'}
                        />
                        <Typography variant="body2">{project.usage}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {project.services.slice(0, 2).map((service, i) => (
                          <Chip key={i} label={service} size="small" variant="outlined" />
                        ))}
                        {project.services.length > 2 && (
                          <Chip label={`+${project.services.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={project.status}
                        color={project.status === 'Otimizado' ? 'success' : 'warning'}
                        size="small"
                        icon={project.status === 'Otimizado' ? <CheckCircle /> : <Warning />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="subtitle2" 
                        color={project.savings > 0 ? 'success.main' : 'text.secondary'}
                        fontWeight="bold"
                      >
                        {project.savings > 0 ? `$${project.savings.toLocaleString()}` : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                🚀 Otimizações Recomendadas
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">• Redimensionar HANA Cloud - Vale (Economia: $450/mês)</Typography>
                <Typography variant="body2">• Otimizar Integration Suite - Petrobras (Economia: $320/mês)</Typography>
                <Typography variant="body2">• Consolidar Analytics Cloud - Embraer (Economia: $280/mês)</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                📊 Insights FinOps
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">• 67% dos projetos estão abaixo do orçamento</Typography>
                <Typography variant="body2">• Economia média de 24% com otimizações UXFLOW</Typography>
                <Typography variant="body2">• ROI de 340% em controle de custos BTP</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}