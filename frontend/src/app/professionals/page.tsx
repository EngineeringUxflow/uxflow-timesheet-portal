'use client';

import { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, Box, Chip, Avatar, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, LinearProgress, Alert, Tabs, Tab, Rating
} from '@mui/material';
import { 
  Person, Business, Star, TrendingUp, Add, Edit, Delete, Assessment, 
  WorkHistory, School, EmojiEvents, Timeline
} from '@mui/icons-material';

interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  level: string;
  company: string;
  rating: number;
  projects: number;
  hours: number;
  specialties: string[];
  certifications: string[];
  performance: {
    deliveryOnTime: number;
    qualityScore: number;
    clientSatisfaction: number;
    teamwork: number;
  };
  projectHistory: {
    project: string;
    client: string;
    role: string;
    duration: string;
    rating: number;
    deliveredOnTime: boolean;
  }[];
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uxflow_professionals');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: '1',
        name: 'Carlos Silva',
        email: 'carlos.silva@uxflow.tech',
        role: 'SAP FI Senior',
        level: 'Senior',
        company: 'Petrobras',
        rating: 4.9,
        projects: 12,
        hours: 1840,
        specialties: ['FI', 'CO', 'S/4HANA'],
        certifications: ['SAP FI Certified', 'S/4HANA Finance'],
        performance: {
          deliveryOnTime: 95,
          qualityScore: 92,
          clientSatisfaction: 98,
          teamwork: 89
        },
        projectHistory: [
          { project: 'SAP S/4HANA Migration', client: 'Petrobras', role: 'Lead FI', duration: '8 meses', rating: 5.0, deliveredOnTime: true },
          { project: 'Financial Reporting', client: 'Vale', role: 'FI Consultant', duration: '4 meses', rating: 4.8, deliveredOnTime: true }
        ]
      },
      {
        id: '2',
        name: 'Ana Costa',
        email: 'ana.costa@uxflow.tech',
        role: 'SAP MM Specialist',
        level: 'Pleno',
        company: 'Vale',
        rating: 4.8,
        projects: 8,
        hours: 1520,
        specialties: ['MM', 'WM', 'BTP'],
        certifications: ['SAP MM Certified', 'BTP Integration'],
        performance: {
          deliveryOnTime: 88,
          qualityScore: 94,
          clientSatisfaction: 91,
          teamwork: 96
        },
        projectHistory: [
          { project: 'Supply Chain Optimization', client: 'Vale', role: 'MM Lead', duration: '6 meses', rating: 4.9, deliveredOnTime: true },
          { project: 'Warehouse Management', client: 'Embraer', role: 'WM Consultant', duration: '3 meses', rating: 4.7, deliveredOnTime: false }
        ]
      }
    ];
  });

  const [open, setOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    level: 'Junior',
    specialties: '',
    certifications: ''
  });

  const saveToStorage = (data: Professional[]) => {
    localStorage.setItem('uxflow_professionals', JSON.stringify(data));
  };

  const handleSubmit = () => {
    const newProfessional: Professional = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      level: formData.level,
      company: 'UXFLOW',
      rating: 4.0,
      projects: 0,
      hours: 0,
      specialties: formData.specialties.split(',').map(s => s.trim()),
      certifications: formData.certifications.split(',').map(s => s.trim()),
      performance: {
        deliveryOnTime: 85,
        qualityScore: 80,
        clientSatisfaction: 85,
        teamwork: 80
      },
      projectHistory: []
    };

    const updated = [...professionals, newProfessional];
    setProfessionals(updated);
    saveToStorage(updated);
    setOpen(false);
    setFormData({ name: '', email: '', role: '', level: 'Junior', specialties: '', certifications: '' });
    alert('✅ Profissional cadastrado com sucesso!');
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'error';
  };

  const getOverallRating = (performance: any) => {
    const avg = (performance.deliveryOnTime + performance.qualityScore + 
                performance.clientSatisfaction + performance.teamwork) / 4;
    return (avg / 20).toFixed(1); // Convert to 5-star scale
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          👥 Profissionais SAP - UXFLOW
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3 }}
        >
          Novo Profissional
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">{professionals.length}</Typography>
                  <Typography>Consultores Ativos</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Star sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {(professionals.reduce((acc, p) => acc + p.rating, 0) / professionals.length).toFixed(1)}
                  </Typography>
                  <Typography>Rating Médio</Typography>
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
                  <Typography variant="h4" fontWeight="bold">
                    {professionals.reduce((acc, p) => acc + p.projects, 0)}
                  </Typography>
                  <Typography>Projetos Totais</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {Math.round(professionals.reduce((acc, p) => acc + p.performance.clientSatisfaction, 0) / professionals.length)}%
                  </Typography>
                  <Typography>Satisfação Cliente</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Professionals Grid */}
      <Grid container spacing={3}>
        {professionals.map((prof) => (
          <Grid item xs={12} md={6} lg={4} key={prof.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: '#3182ce', mr: 2, width: 60, height: 60 }}>
                    {prof.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {prof.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prof.role}
                    </Typography>
                    <Chip label={prof.level} size="small" color="primary" />
                  </Box>
                </Box>

                {/* Performance Metrics */}
                <Box mb={3}>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    📊 Performance Geral
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="caption" sx={{ minWidth: 80 }}>Entregas:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={prof.performance.deliveryOnTime} 
                      sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      color={getPerformanceColor(prof.performance.deliveryOnTime)}
                    />
                    <Typography variant="caption">{prof.performance.deliveryOnTime}%</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="caption" sx={{ minWidth: 80 }}>Qualidade:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={prof.performance.qualityScore} 
                      sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      color={getPerformanceColor(prof.performance.qualityScore)}
                    />
                    <Typography variant="caption">{prof.performance.qualityScore}%</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 80 }}>Cliente:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={prof.performance.clientSatisfaction} 
                      sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      color={getPerformanceColor(prof.performance.clientSatisfaction)}
                    />
                    <Typography variant="caption">{prof.performance.clientSatisfaction}%</Typography>
                  </Box>
                </Box>

                {/* Stats */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">{prof.rating}</Typography>
                    <Typography variant="caption">Rating</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">{prof.projects}</Typography>
                    <Typography variant="caption">Projetos</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">{prof.hours}h</Typography>
                    <Typography variant="caption">Total</Typography>
                  </Box>
                </Box>

                {/* Specialties */}
                <Box display="flex" gap={1} mb={3} flexWrap="wrap">
                  {prof.specialties.slice(0, 3).map((spec, i) => (
                    <Chip key={i} label={spec} size="small" color="primary" variant="outlined" />
                  ))}
                  {prof.specialties.length > 3 && (
                    <Chip label={`+${prof.specialties.length - 3}`} size="small" variant="outlined" />
                  )}
                </Box>

                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => setSelectedProfessional(prof)}
                >
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Professional Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Profissional</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Cargo/Função"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="Ex: SAP FI Senior"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Nível</InputLabel>
                <Select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                  <MenuItem value="Junior">Junior</MenuItem>
                  <MenuItem value="Pleno">Pleno</MenuItem>
                  <MenuItem value="Senior">Senior</MenuItem>
                  <MenuItem value="Especialista">Especialista</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Especialidades"
                value={formData.specialties}
                onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                placeholder="Ex: FI, CO, S/4HANA (separado por vírgula)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certificações"
                value={formData.certifications}
                onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                placeholder="Ex: SAP FI Certified, S/4HANA Finance (separado por vírgula)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email || !formData.role}
          >
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Professional Detail Dialog */}
      <Dialog 
        open={!!selectedProfessional} 
        onClose={() => setSelectedProfessional(null)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedProfessional && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#3182ce', mr: 2 }}>
                  {selectedProfessional.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedProfessional.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedProfessional.role}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                <Tab label="Performance" />
                <Tab label="Histórico" />
                <Tab label="Certificações" />
              </Tabs>

              {activeTab === 0 && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <strong>Rating Geral:</strong> {getOverallRating(selectedProfessional.performance)}/5.0 baseado em {selectedProfessional.projects} projetos
                  </Alert>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        📅 Entregas no Prazo
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfessional.performance.deliveryOnTime} 
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                        color={getPerformanceColor(selectedProfessional.performance.deliveryOnTime)}
                      />
                      <Typography variant="body2">{selectedProfessional.performance.deliveryOnTime}%</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        🎯 Qualidade das Entregas
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfessional.performance.qualityScore} 
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                        color={getPerformanceColor(selectedProfessional.performance.qualityScore)}
                      />
                      <Typography variant="body2">{selectedProfessional.performance.qualityScore}%</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        😊 Satisfação do Cliente
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfessional.performance.clientSatisfaction} 
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                        color={getPerformanceColor(selectedProfessional.performance.clientSatisfaction)}
                      />
                      <Typography variant="body2">{selectedProfessional.performance.clientSatisfaction}%</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        🤝 Trabalho em Equipe
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedProfessional.performance.teamwork} 
                        sx={{ height: 10, borderRadius: 5, mb: 1 }}
                        color={getPerformanceColor(selectedProfessional.performance.teamwork)}
                      />
                      <Typography variant="body2">{selectedProfessional.performance.teamwork}%</Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Projeto</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Função</TableCell>
                        <TableCell>Duração</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProfessional.projectHistory.map((project, index) => (
                        <TableRow key={index}>
                          <TableCell>{project.project}</TableCell>
                          <TableCell>{project.client}</TableCell>
                          <TableCell>{project.role}</TableCell>
                          <TableCell>{project.duration}</TableCell>
                          <TableCell>
                            <Rating value={project.rating} readOnly size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={project.deliveredOnTime ? 'No Prazo' : 'Atrasado'}
                              color={project.deliveredOnTime ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    🏆 Certificações
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedProfessional.certifications.map((cert, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" alignItems="center">
                              <EmojiEvents sx={{ color: '#ffd700', mr: 2 }} />
                              <Typography variant="body1">{cert}</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
                    🎯 Especialidades
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedProfessional.specialties.map((spec, index) => (
                      <Chip key={index} label={spec} color="primary" />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedProfessional(null)}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}