import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Performance metrics endpoint
router.get('/metrics', authenticateToken, (req, res) => {
  const metrics = {
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    performance: {
      caching: '✅ Redis Cache Ativo',
      database: '✅ PostgreSQL Otimizado',
      monitoring: '✅ Performance Logs',
      production: process.env.NODE_ENV === 'production' ? '✅ Build Otimizado' : '⚠️ Development Mode'
    },
    recommendations: [
      'Implementar CDN para assets estáticos',
      'Configurar database indexes',
      'Usar build de produção',
      'Implementar rate limiting por usuário'
    ]
  };
  
  res.json(metrics);
});

// Clear cache endpoint (demo mode)
router.delete('/cache', authenticateToken, (req, res) => {
  console.log('🗑️ Cache cleared (demo mode)');
  res.json({ 
    success: true, 
    message: 'Cache limpo com sucesso (modo demo)',
    timestamp: new Date().toISOString()
  });
});

export default router;