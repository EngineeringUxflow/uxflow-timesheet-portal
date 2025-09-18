'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Button, Box, Chip, Alert, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Speed, Memory, Timer, CloudQueue, Delete, Refresh, CheckCircle } from '@mui/icons-material';

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performance/metrics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/performance/cache`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      alert(result.message);
      fetchMetrics();
    } catch (error) {
      alert('Erro ao limpar cache');
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          ⚡ Performance & Otimização - UXFLOW
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={fetchMetrics}
            disabled={loading}
          >
            Atualizar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Delete />}
            onClick={clearCache}
            color="warning"
          >
            Limpar Cache
          </Button>
        </Box>
      </Box>

      {metrics && (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Timer sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {Math.round(metrics.uptime / 60)}m
                      </Typography>
                      <Typography variant="body2">Uptime</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Memory sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {Math.round(metrics.memory.heapUsed / 1024 / 1024)}MB
                      </Typography>
                      <Typography variant="body2">Memória</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Speed sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {metrics.environment === 'production' ? 'PROD' : 'DEV'}
                      </Typography>
                      <Typography variant="body2">Ambiente</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CloudQueue sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        ✅
                      </Typography>
                      <Typography variant="body2">Cache Redis</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                📊 Status de Performance
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(metrics.performance).map(([key, value]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Typography>
                      <Chip 
                        label={value as string}
                        size="small"
                        color={(value as string).includes('✅') ? 'success' : 'warning'}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                🚀 Recomendações para Produção
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Versão Demo:</strong> Estas otimizações estão preparadas para implementação em ambiente de produção dos clientes.
              </Alert>
              <List>
                {metrics.recommendations.map((rec: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}