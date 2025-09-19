import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
  timestamp: string;
}

export class DataSyncService {
  // Sync localStorage data to PostgreSQL
  static async syncTimesheetsToDatabase(localData: any[]): Promise<SyncResult> {
    const errors: string[] = [];
    let synced = 0;

    try {
      for (const record of localData) {
        try {
          // Check if record already exists
          const existing = await prisma.timesheet.findFirst({
            where: {
              AND: [
                { date: new Date(record.date) },
                { hours: record.hours },
                { description: record.task || record.description }
              ]
            }
          });

          if (!existing) {
            await prisma.timesheet.create({
              data: {
                userId: 'demo-user-id',
                projectId: 'demo-project-id',
                date: new Date(record.date),
                hours: record.hours,
                description: record.task || record.description,
                activity: record.activity || 'DEVELOPMENT',
                approved: record.status === 'APPROVED'
              }
            });
            synced++;
          }
        } catch (error: any) {
          errors.push(`Record ${record.id}: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        synced,
        errors,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      return {
        success: false,
        synced: 0,
        errors: [error.message],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get all timesheets from database
  static async getAllTimesheetsFromDatabase() {
    try {
      const timesheets = await prisma.timesheet.findMany({
        include: {
          project: true
        },
        orderBy: {
          date: 'desc'
        }
      });

      return {
        success: true,
        data: timesheets.map(t => ({
          id: t.id,
          date: t.date.toISOString().split('T')[0],
          task: t.description,
          project: t.project?.name || 'SAP S/4HANA - Petrobras',
          activity: t.activity,
          hours: t.hours,
          status: t.approved ? 'APPROVED' : 'PENDING'
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Clean up duplicate records
  static async cleanupDuplicates(): Promise<SyncResult> {
    try {
      // Find duplicates based on date, hours, and description
      const duplicates = await prisma.$queryRaw`
        SELECT date, hours, description, COUNT(*) as count
        FROM "Timesheet"
        GROUP BY date, hours, description
        HAVING COUNT(*) > 1
      ` as any[];

      let cleaned = 0;
      const errors: string[] = [];

      for (const dup of duplicates) {
        try {
          // Keep the first record, delete the rest
          const records = await prisma.timesheet.findMany({
            where: {
              date: dup.date,
              hours: dup.hours,
              description: dup.description
            },
            orderBy: { createdAt: 'asc' }
          });

          // Delete all but the first
          for (let i = 1; i < records.length; i++) {
            await prisma.timesheet.delete({
              where: { id: records[i].id }
            });
            cleaned++;
          }
        } catch (error: any) {
          errors.push(`Cleanup error: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        synced: cleaned,
        errors,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      return {
        success: false,
        synced: 0,
        errors: [error.message],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Validate data integrity
  static async validateDataIntegrity() {
    try {
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for negative hours
      const negativeHours = await prisma.timesheet.count({
        where: { hours: { lt: 0 } }
      });

      if (negativeHours > 0) {
        issues.push(`${negativeHours} records with negative hours`);
        recommendations.push('Fix negative hour entries');
      }

      // Check for excessive hours (>24h per day)
      const excessiveHours = await prisma.timesheet.count({
        where: { hours: { gt: 24 } }
      });

      if (excessiveHours > 0) {
        issues.push(`${excessiveHours} records with >24 hours`);
        recommendations.push('Review excessive hour entries');
      }

      // Check for missing descriptions
      const missingDescriptions = await prisma.timesheet.count({
        where: { 
          OR: [
            { description: null },
            { description: '' }
          ]
        }
      });

      if (missingDescriptions > 0) {
        issues.push(`${missingDescriptions} records without description`);
        recommendations.push('Add descriptions to incomplete records');
      }

      return {
        valid: issues.length === 0,
        issues,
        recommendations,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      return {
        valid: false,
        issues: ['Data validation failed'],
        recommendations: ['Check database connection'],
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}