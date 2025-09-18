import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create or find UXFLOW company
  const uxflowCompany = await prisma.company.upsert({
    where: { email: 'admin@uxflow.com' },
    update: {},
    create: {
      name: 'UXFLOW Consultoria',
      email: 'admin@uxflow.com',
      plan: 'ENTERPRISE',
      maxUsers: 100
    }
  });

  // Create or find demo company
  const demoCompany = await prisma.company.upsert({
    where: { email: 'empresa@demo.com' },
    update: {},
    create: {
      name: 'Empresa Demo',
      email: 'empresa@demo.com',
      plan: 'PROFESSIONAL',
      maxUsers: 50
    }
  });

  // Create demo user only
  const hashedPassword = await bcrypt.hash('demo123', 10);



  // Create demo user for client presentations
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@uxflow.com' },
    update: {},
    create: {
      email: 'demo@uxflow.com',
      name: 'Demo UXFLOW',
      password: hashedPassword,
      role: 'CONSULTANT',
      companyId: uxflowCompany.id
    }
  });

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'SAP S/4HANA Implementation',
      description: 'Full S/4HANA implementation for manufacturing company',
      sapModule: 'FI',
      client: 'Petrobras',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 500000,
      hourlyRate: 200,
      companyId: demoCompany.id
    }
  });

  // Create sample timesheets
  await prisma.timesheet.createMany({
    data: [
      {
        userId: demoUser.id,
        projectId: project.id,
        date: new Date('2024-01-15'),
        hours: 8,
        description: 'FI Configuration - Accounts Payable',
        activity: 'CONFIGURATION'
      },
      {
        userId: demoUser.id,
        projectId: project.id,
        date: new Date('2024-01-16'),
        hours: 6,
        description: 'Custom report development',
        activity: 'DEVELOPMENT'
      }
    ]
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });