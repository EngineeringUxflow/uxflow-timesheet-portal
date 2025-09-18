import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
// Simple auth middleware for demo
const authenticateToken = (req: any, res: any, next: any) => {
  // Demo user for testing
  req.user = { userId: 'demo-user-id' };
  next();
};

const router = Router();
const prisma = new PrismaClient();

// GET /api/timesheets - List user timesheets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    
    const timesheets = await prisma.timesheet.findMany({
      where: { userId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            client: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    console.log(`📋 Buscando timesheets para usuário ${userId}: ${timesheets.length} registros encontrados`);
    
    res.json(timesheets);
  } catch (error) {
    console.error('❌ Erro ao buscar timesheets:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/timesheets - Create new timesheet
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = 'demo-user-id'; // Fixed for demo
    const { projectId, date, hours, description, activity, status } = req.body;

    // Validate required fields
    if (!date || !hours || !description || !activity) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: date, hours, description, activity' 
      });
    }

    // For demo, create simple response without database
    const mockTimesheet = {
      id: 'demo-timesheet-' + Date.now(),
      userId,
      projectId: projectId || 'demo-project-id',
      date: new Date(date),
      hours: parseFloat(hours),
      description,
      activity: activity.toUpperCase(),
      approved: status === 'APPROVED',
      project: {
        id: 'demo-project-id',
        name: 'SAP S/4HANA - Petrobras',
        client: 'Petrobras'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log(`✅ Timesheet demo criado:`, {
      id: mockTimesheet.id,
      userId,
      date,
      hours,
      description
    });

    res.status(201).json(mockTimesheet);
  } catch (error) {
    console.error('❌ Erro ao criar timesheet:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/timesheets/:id - Update timesheet
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { projectId, date, hours, description, activity, status } = req.body;

    // Check if timesheet exists and belongs to user
    const existingTimesheet = await prisma.timesheet.findFirst({
      where: { id, userId }
    });

    if (!existingTimesheet) {
      return res.status(404).json({ error: 'Timesheet não encontrado' });
    }

    // Update timesheet
    const timesheet = await prisma.timesheet.update({
      where: { id },
      data: {
        projectId,
        date: new Date(date),
        hours: parseFloat(hours),
        description,
        activity: activity.toUpperCase(),
        approved: status === 'APPROVED'
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            client: true
          }
        }
      }
    });

    console.log(`✅ Timesheet atualizado:`, { id, userId });
    res.json(timesheet);
  } catch (error) {
    console.error('❌ Erro ao atualizar timesheet:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/timesheets/:id - Delete timesheet
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    // Check if timesheet exists and belongs to user
    const existingTimesheet = await prisma.timesheet.findFirst({
      where: { id, userId }
    });

    if (!existingTimesheet) {
      return res.status(404).json({ error: 'Timesheet não encontrado' });
    }

    // Delete timesheet
    await prisma.timesheet.delete({
      where: { id }
    });

    console.log(`✅ Timesheet excluído:`, { id, userId });
    res.json({ success: true, message: 'Timesheet excluído com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao excluir timesheet:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;