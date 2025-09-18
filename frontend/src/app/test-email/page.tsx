'use client';

import { useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Box, Alert, CircularProgress } from '@mui/material';
import { Email, CheckCircle, Error, Settings } from '@mui/icons-material';

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  const checkStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test/sendgrid-status`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setStatus({
        configured: false,
        mode: 'ERROR',
        error: 'Erro de conexão com o servidor'
      });
    }
  };

  const testEmail = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test/test-sendgrid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erro na requisição:', error);
      setResult({
        success: false,
        error: 'Erro de conexão com o servidor',
        details: 'Verifique se o backend está rodando na porta 8000',
        troubleshooting: 'Execute: docker-compose ps para verificar os containers'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        🧪 Teste de Email SendGrid
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Status da Configuração</Typography>
            <Button 
              variant="outlined" 
              startIcon={<Settings />}
              onClick={checkStatus}
            >
              Verificar Status
            </Button>
          </Box>
          
          {status && (
            <Box>
              <Alert severity={status.mode === 'REAL' ? 'success' : 'info'} sx={{ mb: 2 }}>
                <strong>Modo:</strong> {status.mode === 'DEMO' ? '🎭 DEMO (Simulação)' : '✅ REAL (SendGrid)'}
              </Alert>
              <Typography variant="body2" mb={1}>
                <strong>From:</strong> {status.fromName} &lt;{status.fromEmail}&gt;
              </Typography>
              <Typography variant="body2">
                <strong>Destinatários:</strong> {status.recipients.join(', ')}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>Teste de Envio</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Este teste enviará um email de aprovação de timesheet para os emails configurados.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <Email />}
            onClick={testEmail}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Enviando...' : 'Enviar Email de Teste'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              {result.success ? (
                <CheckCircle color="success" sx={{ mr: 1 }} />
              ) : (
                <Error color="error" sx={{ mr: 1 }} />
              )}
              <Typography variant="h6">
                {result.success ? 'Sucesso!' : 'Erro'}
              </Typography>
            </Box>
            
            <Alert severity={result.success ? 'success' : 'error'} sx={{ mb: 2 }}>
              {result.message || result.error}
            </Alert>
            
            {result.success && result.recipients && (
              <Typography variant="body2" mb={1}>
                <strong>Enviado para:</strong> {result.recipients.join(', ')}
              </Typography>
            )}
            
            {result.details && (
              <Typography variant="body2" color="text.secondary">
                <strong>Detalhes:</strong> {result.details}
              </Typography>
            )}
            
            {result.instructions && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {result.instructions}
              </Alert>
            )}
            
            {result.troubleshooting && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <strong>Troubleshooting:</strong> {result.troubleshooting}
              </Alert>
            )}
            
            {result.mode && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Modo de Execução:</strong> {result.mode}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}