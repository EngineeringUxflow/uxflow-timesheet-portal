import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Initialize demo data
router.post('/init', async (req, res) => {
  try {
    console.log('🚀 Inicializando dados demo...');

    // Create demo company
    const company = await prisma.company.upsert({
      where: { email: 'demo@uxflow.com' },
      update: {},
      create: {
        id: 'demo-company-id',
        name: 'UXFLOW Consultoria',
        email: 'demo@uxflow.com',
        plan: 'PROFESSIONAL'
      }
    });

    // Create demo user
    const user = await prisma.user.upsert({
      where: { email: 'demo@uxflow.com' },
      update: {},
      create: {
        id: 'demo-user-id',
        email: 'demo@uxflow.com',
        name: 'Demo UXFLOW',
        password: '$2a$10$demo.hash.for.testing.purposes.only',
        role: 'CONSULTANT',
        companyId: company.id
      }
    });

    // Create demo project
    const project = await prisma.project.upsert({
      where: { id: 'demo-project-id' },
      update: {},
      create: {
        id: 'demo-project-id',
        name: 'SAP S/4HANA - Petrobras',
        description: 'Projeto de migração SAP',
        sapModule: 'FI',
        client: 'Petrobras',
        startDate: new Date('2025-01-01'),
        hourlyRate: 150.0,
        companyId: company.id
      }
    });

    console.log('✅ Dados demo inicializados com sucesso');
    
    res.json({
      success: true,
      message: 'Dados demo inicializados',
      data: { company, user, project }
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar dados demo:', error);
    res.status(500).json({ error: 'Erro ao inicializar dados demo' });
  }
});

export default router;