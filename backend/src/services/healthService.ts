import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    email: ServiceHealth;
    storage: ServiceHealth;
  };
  uptime: number;
  version: string;
}

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

export class HealthService {
  private static startTime = Date.now();

  static async getFullHealthStatus(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkEmailService(),
      this.checkStorage()
    ]);

    const [database, redis, email, storage] = checks.map(result => 
      result.status === 'fulfilled' ? result.value : {
        status: 'down' as const,
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        error: result.status === 'rejected' ? result.reason.message : 'Unknown error'
      }
    );

    const overallStatus = this.determineOverallStatus([database, redis, email, storage]);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: { database, redis, email, storage },
      uptime: Date.now() - this.startTime,
      version: '1.0.0'
    };
  }

  private static async checkDatabase(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'up',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private static async checkRedis(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      const redis = new Redis({
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 1
      });
      
      await redis.ping();
      redis.disconnect();
      
      return {
        status: 'up',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private static async checkEmailService(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      // Check if email configuration exists
      const hasEmailConfig = !!(process.env.SENDGRID_API_KEY || process.env.GMAIL_USER);
      
      if (!hasEmailConfig) {
        return {
          status: 'degraded',
          responseTime: Date.now() - start,
          lastCheck: new Date().toISOString(),
          error: 'Email service not configured'
        };
      }

      return {
        status: 'up',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private static async checkStorage(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      // Check disk space and write permissions
      const fs = require('fs');
      const path = require('path');
      
      const testFile = path.join(process.cwd(), 'health-test.tmp');
      fs.writeFileSync(testFile, 'health check');
      fs.unlinkSync(testFile);

      return {
        status: 'up',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private static determineOverallStatus(services: ServiceHealth[]): 'healthy' | 'degraded' | 'unhealthy' {
    const downServices = services.filter(s => s.status === 'down').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;

    if (downServices > 0) return 'unhealthy';
    if (degradedServices > 0) return 'degraded';
    return 'healthy';
  }

  static async checkDataConsistency(): Promise<{
    consistent: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check for orphaned records
      const timesheetsWithoutUsers = await prisma.timesheet.count({
        where: { userId: null }
      });

      if (timesheetsWithoutUsers > 0) {
        issues.push(`${timesheetsWithoutUsers} timesheets without valid user`);
        recommendations.push('Clean up orphaned timesheet records');
      }

      // Check for future dates
      const futureTimesheets = await prisma.timesheet.count({
        where: {
          date: {
            gt: new Date()
          }
        }
      });

      if (futureTimesheets > 0) {
        issues.push(`${futureTimesheets} timesheets with future dates`);
        recommendations.push('Review and validate future timesheet entries');
      }

      return {
        consistent: issues.length === 0,
        issues,
        recommendations
      };

    } catch (error) {
      return {
        consistent: false,
        issues: ['Database consistency check failed'],
        recommendations: ['Check database connection and schema']
      };
    }
  }
}