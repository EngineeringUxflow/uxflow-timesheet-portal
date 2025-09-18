'use client';

import { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  LinearProgress, Chip, Button, Dialog, DialogTitle, DialogContent,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { 
  TrendingUp, AttachMoney, Schedule, Person,
  PieChart, BarChart, Timeline
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale
);

interface ProjectMetrics {
  id: string;
  name: string;
  client: string;
  sapModule: string;
  budget: number;
  spent: number;
  hoursPlanned: number;
  hoursExecuted: number;
  profitMargin: number;
  status: string;
  team: any[];
  timeline: any[];
}

export default function ManagerPage() {
  const [projects, setProjects] = useState<ProjectMetrics[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchProjectMetrics();
  }, []);

  const fetchProjectMetrics = async () => {
    // Mock data com métricas avançadas
    const mockProjects: ProjectMetrics[] = [
      {
        id: '1',
        name: 'SAP S/4HANA - Petrobras',
        client: 'Petrobras',
        sapModule: 'FI/CO',
        budget: 500000,
        spent: 320000,
        hoursPlanned: 2000,
        hoursExecuted: 1280,
        profitMargin: 36,
        status: 'EM_ANDAMENTO',
        team: [
          { name: 'João Silva', role: 'Senior', efficiency: 95, hours: 320 },
          { name: 'Maria Santos', role: 'Pleno', efficiency: 88, hours: 280 },
          { name: 'Pedro Costa', role: 'Junior', efficiency: 75, hours: 240 }
        ],
        timeline: [
          { phase: 'Análise', planned: 200, executed: 180, status: 'CONCLUIDO' },
          { phase: 'Desenvolvimento', planned: 800, executed: 650, status: 'EM_ANDAMENTO' },
          { phase: 'Testes', planned: 400, executed: 0, status: 'PENDENTE' }
        ]
      },
      {
        id: '2',
        name: 'BTP Integration - Vale',
        client: 'Vale',
        sapModule: 'BTP/CPI',
        budget: 300000,
        spent: 180000,
        hoursPlanned: 1200,
        hoursExecuted: 720,
        profitMargin: 40,
        status: 'EM_ANDAMENTO',
        team: [
          { name: 'Ana Lima', role: 'Lead', efficiency: 98, hours: 400 },
          { name: 'Carlos Rocha', role: 'Senior', efficiency: 92, hours: 320 }
        ],
        timeline: [
          { phase: 'Setup BTP', planned: 300, executed: 280, status: 'CONCLUIDO' },
          { phase: 'Integrações', planned: 600, executed: 440, status: 'EM_ANDAMENTO' },
          { phase: 'Go-Live', planned: 300, executed: 0, status: 'PENDENTE' }
        ]
      }
    ];
    
    setProjects(mockProjects);
  };

  // Dados para gráficos
  const profitabilityData = {
    labels: projects.map(p => p.name),
    datasets: [{
      label: 'Margem de Lucro (%)',
      data: projects.map(p => p.profitMargin),
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)'
      ],
      borderWidth: 2
    }]
  };

  const budgetData = {
    labels: ['Orçado', 'Executado', 'Restante'],
    datasets: [{
      data: [
        projects.reduce((acc, p) => acc + p.budget, 0),
        projects.reduce((acc, p) => acc + p.spent, 0),
        projects.reduce((acc, p) => acc + (p.budget - p.spent), 0)
      ],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
    }]
  };

  const efficiencyData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{
      label: 'Eficiência da Equipe (%)',
      data: [85, 88, 92, 89, 94, 91],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4
    }]
  };

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const totalProfit = totalBudget - totalSpent;
  const avgProfitMargin = projects.reduce((acc, p) => acc + p.profitMargin, 0) / projects.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Dashboard Gerencial - Projetos SAP
      </Typography>

      {/* KPIs Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    R$ {totalProfit.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Lucro Total</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {avgProfitMargin.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">Margem Média</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {projects.reduce((acc, p) => acc + p.hoursExecuted, 0)}h
                  </Typography>
                  <Typography variant="body2">Horas Executadas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {projects.reduce((acc, p) => acc + p.team.length, 0)}
                  </Typography>
                  <Typography variant="body2">Profissionais</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Margem de Lucro por Projeto</Typography>
            <Bar data={profitabilityData} options={{ responsive: true }} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Distribuição Orçamentária</Typography>
            <Doughnut data={budgetData} options={{ responsive: true }} />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Eficiência da Equipe ao Longo do Tempo</Typography>
            <Line data={efficiencyData} options={{ responsive: true }} />
          </Card>
        </Grid>
      </Grid>

      {/* Projects Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" mb={3} fontWeight="bold">
            Projetos em Andamento
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Projeto</strong></TableCell>
                  <TableCell><strong>Cliente</strong></TableCell>
                  <TableCell><strong>Módulo SAP</strong></TableCell>
                  <TableCell><strong>Orçamento</strong></TableCell>
                  <TableCell><strong>Executado</strong></TableCell>
                  <TableCell><strong>Progresso</strong></TableCell>
                  <TableCell><strong>Margem</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell><strong>{project.name}</strong></TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      <Chip label={project.sapModule} size="small" />
                    </TableCell>
                    <TableCell>R$ {project.budget.toLocaleString()}</TableCell>
                    <TableCell>R$ {project.spent.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LinearProgress 
                          variant="determinate" 
                          value={(project.hoursExecuted / project.hoursPlanned) * 100}
                          sx={{ width: 100, mr: 1 }}
                        />
                        <Typography variant="caption">
                          {Math.round((project.hoursExecuted / project.hoursPlanned) * 100)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${project.profitMargin}%`}
                        color={project.profitMargin > 30 ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={project.status.replace('_', ' ')}
                        color="info"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          setSelectedProject(project.id);
                          setDetailsOpen(true);
                        }}
                      >
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalhes do Projeto</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Análise Detalhada de Rentabilidade
              </Typography>
              {/* Detailed project analysis would go here */}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}