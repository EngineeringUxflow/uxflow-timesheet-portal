'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Fab, Switch, FormControlLabel,
  Tabs, Tab, Avatar, LinearProgress, Alert
} from '@mui/material';
import { 
  Add, Edit, Delete, AccessTime, PlayArrow, Stop, 
  Schedule, Assignment, TrendingUp, CheckCircle, Pending, ExitToApp, FileDownload
} from '@mui/icons-material';
import { Timesheet } from '../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as XLSX from 'xlsx';

interface Task {
  id: string;
  name: string;
  project: string;
  phase: string;
  allocated: boolean;
  manager?: string;
  managerEmail?: string;
}

export default function Dashboard() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(8); // September = 8 (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [loading, setLoading] = useState(true);
  const [timesheetsLoading, setTimesheetsLoading] = useState(false);
  const [localTimesheets, setLocalTimesheets] = useState(() => {
    // Load from localStorage or use default data
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uxflow_timesheets');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      { id: 1, date: '2025-09-02', task: 'Desenvolvimento Front-end Portal', project: 'SAP S/4HANA - Petrobras', activity: 'DEVELOPMENT', hours: 8, status: 'APPROVED' },
      { id: 2, date: '2025-09-03', task: 'Configuração Módulo FI', project: 'SAP S/4HANA - Petrobras', activity: 'CONFIGURATION', hours: 7.5, status: 'APPROVED' },
      { id: 3, date: '2025-09-04', task: 'Integração BTP APIs', project: 'BTP Integration - Vale', activity: 'INTEGRATION', hours: 8, status: 'PENDING' },
      { id: 4, date: '2025-09-05', task: 'Reunião Cliente', project: 'BTP Integration - Vale', activity: 'MEETING', hours: 2, status: 'APPROVED' },
      { id: 5, date: '2025-09-06', task: 'Testes Unitários', project: 'SAP Analytics - Embraer', activity: 'TESTING', hours: 6, status: 'PENDING' },
      { id: 6, date: '2025-09-09', task: 'Documentação Técnica', project: 'SAP Analytics - Embraer', activity: 'DOCUMENTATION', hours: 4, status: 'DRAFT' },
      { id: 7, date: '2025-09-10', task: 'Code Review', project: 'SAP S/4HANA - Petrobras', activity: 'ANALYSIS', hours: 3, status: 'APPROVED' },
      { id: 8, date: '2025-09-11', task: 'Deploy Produção', project: 'BTP Integration - Vale', activity: 'DEPLOYMENT', hours: 5, status: 'PENDING' }
    ];
  });
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ syncing: false, lastSync: null });
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    consultant: 'all',
    startDate: '2025-09-01',
    endDate: '2025-09-30'
  });
  
  const [formData, setFormData] = useState({
    taskId: '',
    date: '2025-09-16', // Default to September 2025
    hours: 0,
    description: '',
    activity: 'DEVELOPMENT'
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTimesheets(), fetchTasks()]);
      setLoading(false);
    };
    loadData();
  }, []);
  
  // Update tasks when timesheets change
  useEffect(() => {
    fetchTasks();
  }, [localTimesheets]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const fetchTimesheets = async () => {
    try {
      setTimesheetsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timesheets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTimesheets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar timesheets:', error);
      setTimesheets([]);
    } finally {
      setTimesheetsLoading(false);
    }
  };

  const fetchTasks = async () => {
    // Base tasks - sempre disponíveis
    const baseTasks: Task[] = [
      {
        id: '1',
        name: 'Desenvolvimento Front-end - Portal Compras',
        project: 'SAP S/4HANA - Petrobras',
        phase: 'Desenvolvimento',
        allocated: true,
        manager: 'Vladimir Ribeiro',
        managerEmail: 'vladimir.ribeiro.abreu@gmail.com'
      },
      {
        id: '2', 
        name: 'Configuração Módulo FI',
        project: 'SAP S/4HANA - Petrobras',
        phase: 'Configuração',
        allocated: true,
        manager: 'Vladimir Ribeiro',
        managerEmail: 'vladimir.ribeiro.abreu@gmail.com'
      },
      {
        id: '3',
        name: 'Integração BTP - APIs',
        project: 'BTP Integration - Vale',
        phase: 'Integração',
        allocated: true,
        manager: 'Equipe Comercial',
        managerEmail: 'comercial@uxflow.tech'
      },
      {
        id: '4',
        name: 'Reunião de Planejamento',
        project: 'BTP Integration - Vale',
        phase: 'Planejamento',
        allocated: true,
        manager: 'Equipe Comercial',
        managerEmail: 'comercial@uxflow.tech'
      }
    ];
    
    // Dynamic tasks baseadas nos registros de timesheet
    const dynamicTasks: Task[] = [];
    const uniqueProjects = new Set();
    
    localTimesheets.forEach(record => {
      if (!uniqueProjects.has(record.project) && !baseTasks.find(t => t.project === record.project)) {
        uniqueProjects.add(record.project);
        dynamicTasks.push({
          id: `dynamic_${Date.now()}_${Math.random()}`,
          name: `Atividades Gerais - ${record.project.split(' - ')[0]}`,
          project: record.project,
          phase: 'Atividades Diversas',
          allocated: true,
          manager: record.project.includes('Petrobras') ? 'Vladimir Ribeiro' : 'Equipe Comercial',
          managerEmail: record.project.includes('Petrobras') ? 'vladimir.ribeiro.abreu@gmail.com' : 'comercial@uxflow.tech'
        });
      }
    });
    
    setTasks([...baseTasks, ...dynamicTasks]);
  };

  const handleSubmit = async (sendForApproval = false) => {
    try {
      const selectedTaskData = tasks.find(t => t.id === formData.taskId);
      const token = localStorage.getItem('token');
      
      // Save to database via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timesheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          projectId: 'demo-project-id', // Demo project ID
          date: formData.date,
          hours: formData.hours,
          description: formData.description,
          activity: formData.activity,
          status: sendForApproval ? 'APPROVED' : 'DRAFT'
        })
      });
      
      if (response.ok) {
        const savedTimesheet = await response.json();
        
        // Also update localStorage for immediate UI feedback
        const newRecord = {
          id: savedTimesheet.id,
          date: formData.date,
          task: formData.description,
          project: selectedTaskData?.project || savedTimesheet.project?.name || 'SAP S/4HANA - Petrobras',
          activity: formData.activity,
          hours: formData.hours,
          status: sendForApproval ? 'PENDING' : 'DRAFT'
        };
        
        const updatedRecords = [newRecord, ...localTimesheets];
        setLocalTimesheets(updatedRecords);
        localStorage.setItem('uxflow_timesheets', JSON.stringify(updatedRecords));
        
        alert('✅ Registro salvo no banco de dados com sucesso!');
        console.log('💾 Timesheet salvo:', savedTimesheet);
      } else {
        throw new Error('Erro ao salvar no servidor');
      }
      
      // Send email if approval requested
      if (sendForApproval) {
        try {
          const token = localStorage.getItem('token');
          const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send-demo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              consultantName: 'Demo UXFLOW',
              consultantEmail: 'demo@uxflow.com',
              managerName: selectedTaskData?.manager || 'Vladimir Ribeiro',
              managerEmail: selectedTaskData?.managerEmail || 'vladimir.ribeiro.abreu@gmail.com',
              projectName: selectedTaskData?.project || 'SAP S/4HANA - Petrobras',
              hours: formData.hours,
              date: formData.date,
              activity: formData.activity,
              description: formData.description
            })
          });
          
          const emailResult = await emailResponse.json();
          if (emailResult.success) {
            alert(`📧 Email de aprovação enviado!\n📫 Destinatários: ${emailResult.recipients.join(', ')}\n\n⚠️ IMPORTANTE: Registro mantido no dashboard. Use 'Salvar Alterações' para persistir.`);
          } else {
            alert('⚠️ Erro no envio de email, mas registro foi salvo.');
          }
        } catch (emailError) {
          console.error('Erro no envio de email:', emailError);
          alert('⚠️ Erro no envio de email, mas registro foi salvo.');
        }
      }
      
      // Reset form but preserve records
      setOpen(false);
      setEditingRecord(null);
      setFormData({
        taskId: '',
        date: '2025-09-16',
        hours: 0,
        description: '',
        activity: 'DEVELOPMENT'
      });
      
      // Debug: Log current records
      console.log('📋 Registros atuais após submit:', localTimesheets.length);
      console.log('📋 Último registro adicionado:', newRecord);
    } catch (error) {
      console.error('Erro ao processar timesheet:', error);
    }
  };
  
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      taskId: tasks.find(t => t.project === record.project)?.id || '',
      date: record.date,
      hours: record.hours,
      description: record.task,
      activity: record.activity
    });
    setOpen(true);
  };
  
  const handleDelete = (recordId: number) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      const updatedRecords = localTimesheets.filter(record => record.id !== recordId);
      setLocalTimesheets(updatedRecords);
      localStorage.setItem('uxflow_timesheets', JSON.stringify(updatedRecords));
      setHasUnsavedChanges(true);
      alert('✅ Registro excluído! Clique em "Salvar Alterações" para persistir.');
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      console.log('💾 Sincronizando com banco de dados...');
      
      // Refresh data from database
      await fetchTimesheets();
      
      // Update the main timesheets state
      setTimesheets(localTimesheets.map(record => ({
        id: record.id.toString(),
        date: record.date,
        hours: record.hours,
        description: record.task,
        activity: record.activity,
        approved: record.status === 'APPROVED',
        project: { name: record.project }
      })));
      
      setHasUnsavedChanges(false);
      alert('✅ Dados sincronizados com o banco de dados!\n📊 Dashboard atualizado.');
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      alert('❌ Erro ao sincronizar com banco de dados.');
    }
  };

  const syncToDatabase = async () => {
    try {
      setSyncStatus({ syncing: true, lastSync: null });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sync/sync-timesheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ localData: localTimesheets })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSyncStatus({ syncing: false, lastSync: new Date().toISOString() });
        setHasUnsavedChanges(false);
        alert(`✅ Sincronização concluída!\n📊 ${result.synced} registros sincronizados`);
      } else {
        throw new Error(result.error || 'Erro na sincronização');
      }
    } catch (error) {
      setSyncStatus({ syncing: false, lastSync: null });
      console.error('Erro na sincronização:', error);
      alert('❌ Erro na sincronização. Tente novamente.');
    }
  };

  const loadFromDatabase = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sync/timesheets-from-db`);
      const result = await response.json();
      
      if (result.success) {
        setLocalTimesheets(result.data);
        localStorage.setItem('uxflow_timesheets', JSON.stringify(result.data));
        alert(`✅ Dados carregados do banco!\n📊 ${result.data.length} registros`);
      }
    } catch (error) {
      console.error('Erro ao carregar do banco:', error);
      alert('❌ Erro ao carregar dados do banco.');
    }
  };

  const handleExportExcel = () => {
    try {
      let filteredData = localTimesheets.filter(record => {
        const recordDate = new Date(record.date);
        const startDate = new Date(exportFilters.startDate);
        const endDate = new Date(exportFilters.endDate);
        return recordDate >= startDate && recordDate <= endDate;
      });
      
      const excelData = filteredData.map(record => ({
        'Data': new Date(record.date).toLocaleDateString('pt-BR'),
        'Consultor': 'Demo UXFLOW',
        'Projeto': record.project,
        'Atividade': record.activity,
        'Horas': record.hours,
        'Descrição': record.task,
        'Status': record.status === 'APPROVED' ? 'Aprovado' : record.status === 'PENDING' ? 'Pendente' : 'Rascunho',
        'Valor (R$)': `R$ ${(record.hours * 150).toLocaleString('pt-BR')}`
      }));
      
      const totalHours = filteredData.reduce((sum, record) => sum + record.hours, 0);
      const totalValue = totalHours * 150;
      
      excelData.push({});
      excelData.push({
        'Data': 'TOTAL',
        'Consultor': '',
        'Projeto': '',
        'Atividade': '',
        'Horas': totalHours,
        'Descrição': `${filteredData.length} registros`,
        'Status': '',
        'Valor (R$)': `R$ ${totalValue.toLocaleString('pt-BR')}`
      });
      
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      
      ws['!cols'] = [
        { width: 12 }, { width: 20 }, { width: 25 }, { width: 15 },
        { width: 8 }, { width: 40 }, { width: 12 }, { width: 15 }
      ];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Timesheet');
      
      const filename = `Timesheet_UXFLOW_${exportFilters.startDate}_${exportFilters.endDate}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      setShowExportDialog(false);
      alert(`✅ Relatório exportado!\n📁 ${filename}\n📊 ${filteredData.length} registros\n💰 Total: R$ ${totalValue.toLocaleString('pt-BR')}`);
      
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('❌ Erro ao exportar relatório.');
    }
  };

  const startTimer = () => {
    if (selectedTask) {
      setTimerRunning(true);
      setTimerSeconds(0);
    }
  };

  const stopTimer = () => {
    setTimerRunning(false);
    if (timerSeconds > 0) {
      const hours = timerSeconds / 3600;
      setFormData({
        ...formData,
        taskId: selectedTask,
        hours: parseFloat(hours.toFixed(2))
      });
      setOpen(true);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const weeklyHours = localTimesheets
    .filter(t => {
      const date = new Date(t.date);
      const weekStart = new Date(2025, 8, 8); // September 8, 2025 (Monday)
      const weekEnd = new Date(2025, 8, 14); // September 14, 2025 (Sunday)
      return date >= weekStart && date <= weekEnd;
    })
    .reduce((acc, t) => acc + t.hours, 0);

  const pendingApprovals = localTimesheets.filter(t => t.status === 'PENDING').length;

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Portal SAP Timesheet - UXFLOW
        </Typography>
        <Box display="flex" gap={2}>
          <FormControlLabel
            control={
              <Switch 
                checked={isTimerMode} 
                onChange={(e) => setIsTimerMode(e.target.checked)}
                color="primary"
              />
            }
            label="Cronômetro Inteligente"
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Novo Registro
          </Button>
        </Box>
      </Box>

      {/* Timer Mode */}
      {isTimerMode && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #1a365d 0%, #3182ce 100%)', color: 'white' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h3" fontWeight="bold" mb={2}>
              {formatTime(timerSeconds)}
            </Typography>
            
            <FormControl sx={{ minWidth: 300, mb: 3 }}>
              <InputLabel sx={{ color: 'white' }}>Selecionar Tarefa</InputLabel>
              <Select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                sx={{ 
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  '& .MuiSvgIcon-root': { color: 'white' }
                }}
              >
                {tasks.filter(t => t.allocated).map((task) => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.name} - {task.project}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" justifyContent="center" gap={2}>
              <Fab
                color={timerRunning ? 'secondary' : 'primary'}
                onClick={timerRunning ? stopTimer : startTimer}
                disabled={!selectedTask}
                sx={{ 
                  width: 80, 
                  height: 80,
                  background: timerRunning ? 
                    'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)' :
                    'linear-gradient(135deg, #38a169 0%, #2f855a 100%)'
                }}
              >
                {timerRunning ? <Stop sx={{ fontSize: 40 }} /> : <PlayArrow sx={{ fontSize: 40 }} />}
              </Fab>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Project Hours Summary */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', border: '1px solid #e2e8f0' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            📊 Saldo de Horas por Projeto
          </Typography>
          <Grid container spacing={2}>
            {[
              { name: 'SAP S/4HANA - Petrobras', total: 2000, used: 1247, color: '#3182ce' },
              { name: 'BTP Integration - Vale', total: 1500, used: 892, color: '#38a169' },
              { name: 'SAP Analytics - Embraer', total: 1200, used: 634, color: '#ed8936' }
            ].map((project, index) => {
              const remaining = project.total - project.used;
              const percent = (project.used / project.total) * 100;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ border: `2px solid ${project.color}`, height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        {project.name}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Apontadas:</Typography>
                        <Typography variant="body2" fontWeight="bold">{project.used}h</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Disponíveis:</Typography>
                        <Typography variant="body2" fontWeight="bold" color={remaining < 100 ? 'error.main' : 'success.main'}>
                          {remaining}h
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">Total:</Typography>
                        <Typography variant="body2" fontWeight="bold">{project.total}h</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percent} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: project.color
                          }
                        }}
                      />
                      <Typography variant="caption" display="block" textAlign="center" mt={1}>
                        {percent.toFixed(1)}% utilizado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTime sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {weeklyHours}h
                  </Typography>
                  <Typography variant="body2">Esta Semana</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {tasks.filter(t => t.allocated).length}
                  </Typography>
                  <Typography variant="body2">Tarefas Alocadas</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Pending sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {pendingApprovals}
                  </Typography>
                  <Typography variant="body2">Pendente Aprovação</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    94%
                  </Typography>
                  <Typography variant="body2">Taxa Aprovação</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
            <Tab label="Meus Registros" />
            <Tab label="📅 Calendário Mensal" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Tab 0: Registros */}
          {activeTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  📋 Meus Registros - Setembro 2025
                </Typography>
                <Box display="flex" gap={2}>
                  {hasUnsavedChanges && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={handleSaveChanges}
                      sx={{ borderRadius: 3 }}
                    >
                      Salvar Alterações
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: 3, mr: 2 }}
                  >
                    Novo Registro
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FileDownload />}
                    onClick={() => setShowExportDialog(true)}
                    sx={{ borderRadius: 3, mr: 2 }}
                  >
                    Exportar Excel
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={syncToDatabase}
                    disabled={syncStatus.syncing}
                    sx={{ borderRadius: 3, mr: 2 }}
                  >
                    {syncStatus.syncing ? 'Sincronizando...' : '🔄 Sync DB'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={loadFromDatabase}
                    sx={{ borderRadius: 3 }}
                  >
                    📥 Carregar DB
                  </Button>
                </Box>
              </Box>
              
              {hasUnsavedChanges && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <strong>Alterações não salvas!</strong> Você tem modificações pendentes. Clique em "Salvar Alterações" para persistir no dashboard.
                </Alert>
              )}
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Total de registros:</strong> {localTimesheets.length} | <strong>Pendentes:</strong> {localTimesheets.filter(r => r.status === 'PENDING').length} | <strong>Rascunhos:</strong> {localTimesheets.filter(r => r.status === 'DRAFT').length}
              </Alert>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Data</strong></TableCell>
                      <TableCell><strong>Tarefa</strong></TableCell>
                      <TableCell><strong>Projeto</strong></TableCell>
                      <TableCell><strong>Atividade</strong></TableCell>
                      <TableCell><strong>Horas</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Ações</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {localTimesheets
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{record.task}</TableCell>
                        <TableCell>{record.project}</TableCell>
                        <TableCell>
                          <Chip label={record.activity} variant="outlined" size="small" />
                        </TableCell>
                        <TableCell><strong>{record.hours}h</strong></TableCell>
                        <TableCell>
                          <Chip 
                            label={record.status}
                            color={
                              record.status === 'APPROVED' ? 'success' : 
                              record.status === 'PENDING' ? 'warning' : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEdit(record)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(record.id)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 1: Calendário */}
          {activeTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Calendário Mensal - {new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                </Typography>
                <Box display="flex" gap={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Mês</InputLabel>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                      {Array.from({length: 12}, (_, i) => (
                        <MenuItem key={i} value={i}>
                          {new Date(2025, i).toLocaleDateString('pt-BR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Ano</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {Array.from({length: 75}, (_, i) => (
                        <MenuItem key={i} value={2025 + i}>
                          {2025 + i}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Chip label="Meta: 160h/mês" color="primary" />
                </Box>
              </Box>
              
              {/* Calendar Grid */}
              <Card sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={1}>
                  {/* Header Days */}
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <Grid item xs key={day}>
                      <Typography variant="subtitle2" fontWeight="bold" textAlign="center" py={1}>
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                  
                  {/* Calendar Days */}
                  {(() => {
                    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
                    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                    const days = [];
                    
                    // Empty cells for days before month starts
                    for (let i = 0; i < firstDay; i++) {
                      days.push(
                        <Grid item xs key={`empty-${i}`}>
                          <Box sx={{ height: 80 }} />
                        </Grid>
                      );
                    }
                    
                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const dayOfWeek = new Date(selectedYear, selectedMonth, day).getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                      const hours = isWeekend ? 0 : Math.floor(Math.random() * 9) + 1;
                      const status = isWeekend ? 'weekend' : 
                                   hours >= 8 ? 'completed' : 
                                   hours >= 4 ? 'pending' : 'draft';
                      
                      days.push(
                        <Grid item xs key={day}>
                          <Card sx={{
                            height: 80,
                            p: 1,
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: status === 'pending' ? '2px solid #ed8936' : 
                                   status === 'draft' ? '2px solid #3182ce' : '1px solid #e2e8f0',
                            bgcolor: isWeekend ? '#f7fafc' : 'white',
                            '&:hover': { bgcolor: '#f0f9ff' }
                          }}>
                            <Typography variant="body2" fontWeight="bold">
                              {day}
                            </Typography>
                            {!isWeekend && (
                              <>
                                <Typography variant="caption" color="primary" fontWeight="bold">
                                  {hours}h
                                </Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(hours / 8) * 100}
                                  size="small"
                                  sx={{ mt: 0.5, height: 3 }}
                                  color={status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'info'}
                                />
                              </>
                            )}
                          </Card>
                        </Grid>
                      );
                    }
                    
                    return days;
                  })()}
                </Grid>
              </Card>
              
              <Card sx={{ mt: 3, bgcolor: '#f7fafc' }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color="primary" fontWeight="bold">33.5h</Typography>
                      <Typography variant="body2">Total da Semana</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">84%</Typography>
                      <Typography variant="body2">Meta Atingida</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color="warning.main" fontWeight="bold">2</Typography>
                      <Typography variant="body2">Pendente Aprovação</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="h4" color="info.main" fontWeight="bold">1</Typography>
                      <Typography variant="body2">Rascunhos</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRecord ? 'Editar Registro' : 'Registrar Horas'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tarefa</InputLabel>
                <Select
                  value={formData.taskId}
                  onChange={(e) => setFormData({...formData, taskId: e.target.value})}
                >
                  {tasks.filter(t => t.allocated).map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.name} - {task.project}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Horas"
                type="number"
                value={formData.hours}
                onChange={(e) => {
                  const hours = parseFloat(e.target.value);
                  if (!isNaN(hours) && hours >= 0) {
                    setFormData({...formData, hours});
                  }
                }}
                inputProps={{ step: 0.25, min: 0.25, max: 24 }}
                helperText={formData.hours > 0 ? `Valor: R$ ${(formData.hours * 150).toLocaleString()} | ${formData.hours > 8 ? '⚠️ Hora extra' : '✅ Normal'}` : 'Informe as horas trabalhadas'}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Atividade</InputLabel>
                <Select
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                >
                  {(() => {
                    const savedActivities = typeof window !== 'undefined' ? localStorage.getItem('uxflow_activities') : null;
                    const activities = savedActivities ? JSON.parse(savedActivities) : [
                      { code: 'DEVELOPMENT', name: 'Desenvolvimento' },
                      { code: 'CONFIGURATION', name: 'Configuração' },
                      { code: 'TESTING', name: 'Testes' },
                      { code: 'DOCUMENTATION', name: 'Documentação' },
                      { code: 'MEETING', name: 'Reunião' },
                      { code: 'ANALYSIS', name: 'Análise' }
                    ];
                    return activities.filter((a: any) => a.active !== false).map((activity: any) => (
                      <MenuItem key={activity.code} value={activity.code}>
                        {activity.name}
                      </MenuItem>
                    ));
                  })()}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição da Atividade"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        {/* Hours Summary */}
        {formData.hours > 0 && (
          <Box sx={{ px: 3, py: 2, bgcolor: '#f7fafc', borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              📊 Resumo das Horas:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">Horas Informadas:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">{formData.hours}h</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Valor Estimado:</Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  R$ {(formData.hours * 150).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <DialogActions>
          <Button 
            onClick={() => {
              setOpen(false);
              setFormData({
                taskId: '',
                date: '2025-09-16',
                hours: 0,
                description: '',
                activity: 'DEVELOPMENT'
              });
            }}
            startIcon={<ExitToApp />}
            color="error"
          >
            Sair
          </Button>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => handleSubmit(false)}>
            Salvar como Rascunho
          </Button>
          <Button variant="contained" color="success" onClick={() => handleSubmit(true)}>
            Enviar para Aprovação
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <FileDownload sx={{ mr: 2, color: '#38a169' }} />
            <Typography variant="h6" fontWeight="bold">
              📊 Exportar Timesheet para Excel
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Consultor</InputLabel>
                  <Select
                    value={exportFilters.consultant}
                    label="Consultor"
                    onChange={(e) => setExportFilters({...exportFilters, consultant: e.target.value})}
                  >
                    <MenuItem value="all">📋 Todos os Consultores</MenuItem>
                    <MenuItem value="demo">👤 Demo UXFLOW</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="📅 Data Início"
                  type="date"
                  value={exportFilters.startDate}
                  onChange={(e) => setExportFilters({...exportFilters, startDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="📅 Data Fim"
                  type="date"
                  value={exportFilters.endDate}
                  onChange={(e) => setExportFilters({...exportFilters, endDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>📊 Dados do Relatório:</strong><br/>
                • Período: {new Date(exportFilters.startDate).toLocaleDateString('pt-BR')} até {new Date(exportFilters.endDate).toLocaleDateString('pt-BR')}<br/>
                • Formato: Excel (.xlsx)<br/>
                • Colunas: Data, Consultor, Projeto, Atividade, Horas, Descrição, Status, Valor<br/>
                • Registros: {localTimesheets.filter(r => {
                  const recordDate = new Date(r.date);
                  return recordDate >= new Date(exportFilters.startDate) && recordDate <= new Date(exportFilters.endDate);
                }).length} no período
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            startIcon={<FileDownload />}
            onClick={handleExportExcel}
            sx={{ bgcolor: '#38a169' }}
          >
            📊 Exportar Excel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}