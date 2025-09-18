'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Chip, Alert
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Category } from '@mui/icons-material';

interface Activity {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uxflow_activities');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      { id: '1', code: 'DEV', name: 'Desenvolvimento', description: 'Atividades de desenvolvimento de software', category: 'Técnica', active: true },
      { id: '2', code: 'CONFIG', name: 'Configuração', description: 'Configuração de sistemas SAP', category: 'Técnica', active: true },
      { id: '3', code: 'TEST', name: 'Testes', description: 'Testes unitários e integração', category: 'Qualidade', active: true },
      { id: '4', code: 'DOC', name: 'Documentação', description: 'Elaboração de documentação técnica', category: 'Documentação', active: true },
      { id: '5', code: 'MEET', name: 'Reunião', description: 'Reuniões com cliente e equipe', category: 'Gestão', active: true },
      { id: '6', code: 'ANALYSIS', name: 'Análise', description: 'Análise de requisitos e soluções', category: 'Técnica', active: true }
    ];
  });
  
  const [open, setOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Técnica'
  });

  const saveToStorage = (data: Activity[]) => {
    localStorage.setItem('uxflow_activities', JSON.stringify(data));
  };

  const handleSubmit = () => {
    const newActivity: Activity = {
      id: editingActivity ? editingActivity.id : Date.now().toString(),
      code: formData.code.toUpperCase(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      active: true
    };

    if (editingActivity) {
      const updated = activities.map(a => a.id === editingActivity.id ? newActivity : a);
      setActivities(updated);
      saveToStorage(updated);
      alert('✅ Atividade atualizada com sucesso!');
    } else {
      const updated = [...activities, newActivity];
      setActivities(updated);
      saveToStorage(updated);
      alert('✅ Nova atividade cadastrada com sucesso!');
    }

    setOpen(false);
    setEditingActivity(null);
    setFormData({ code: '', name: '', description: '', category: 'Técnica' });
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      code: activity.code,
      name: activity.name,
      description: activity.description,
      category: activity.category
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      const updated = activities.filter(a => a.id !== id);
      setActivities(updated);
      saveToStorage(updated);
      alert('✅ Atividade excluída com sucesso!');
    }
  };

  const toggleActive = (id: string) => {
    const updated = activities.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    );
    setActivities(updated);
    saveToStorage(updated);
  };

  const categories = ['Técnica', 'Gestão', 'Qualidade', 'Documentação', 'Comercial'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          🏷️ Cadastro de Atividades - UXFLOW
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3 }}
        >
          Nova Atividade
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>💡 Funcionalidade:</strong> Cadastre as atividades que serão utilizadas nos apontamentos de horas. 
        Estas atividades aparecerão no dropdown ao registrar timesheet.
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Category sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {activities.length}
                  </Typography>
                  <Typography variant="body2">Total Atividades</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {activities.filter(a => a.active).length}
                  </Typography>
                  <Typography variant="body2">Ativas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {categories.slice(0, 2).map((category, index) => (
          <Grid item xs={12} md={3} key={category}>
            <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Category sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {activities.filter(a => a.category === category).length}
                    </Typography>
                    <Typography variant="body2">{category}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Activities Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            📋 Lista de Atividades Cadastradas
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Código</strong></TableCell>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Descrição</strong></TableCell>
                  <TableCell><strong>Categoria</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Chip label={activity.code} size="small" color="primary" />
                    </TableCell>
                    <TableCell><strong>{activity.name}</strong></TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>
                      <Chip label={activity.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={activity.active ? 'Ativa' : 'Inativa'}
                        color={activity.active ? 'success' : 'default'}
                        size="small"
                        onClick={() => toggleActive(activity.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(activity)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(activity.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Código"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="Ex: DEV, CONFIG"
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Categoria"
                select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                SelectProps={{ native: true }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Atividade"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Desenvolvimento, Configuração"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva o tipo de atividade..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.code || !formData.name}
          >
            {editingActivity ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}