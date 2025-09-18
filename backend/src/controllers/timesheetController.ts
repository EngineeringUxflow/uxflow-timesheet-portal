import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/notificationService';

export const getTimesheets = async (req: AuthRequest, res: Response) => {
  try {
    const timesheets = await prisma.timesheet.findMany({
      where: {
        user: { companyId: req.user.companyId }
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, name: true, client: true, sapModule: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timesheets' });
  }
};

export const createTimesheet = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, date, hours, description, activity } = req.body;

    const timesheet = await prisma.timesheet.create({
      data: {
        userId: req.user.id,
        projectId,
        date: new Date(date),
        hours: parseFloat(hours),
        description,
        activity
      },
      include: {
        project: {
          select: { name: true, client: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Demo workflow notification
    await NotificationService.notifyApprovalWorkflow(timesheet, 'SUBMITTED');

    res.status(201).json(timesheet);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create timesheet' });
  }
};

export const approveTimesheet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const timesheet = await prisma.timesheet.update({
      where: { id },
      data: { approved: true },
      include: {
        project: {
          select: { name: true, client: true }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Demo workflow notification
    await NotificationService.notifyApprovalWorkflow(timesheet, 'APPROVED');

    res.json(timesheet);
  } catch (error) {
    res.status(400).json({ error: 'Failed to approve timesheet' });
  }
};