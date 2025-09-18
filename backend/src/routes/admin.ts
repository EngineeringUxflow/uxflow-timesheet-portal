import express from 'express';
import { companies, users } from './auth';
const router = express.Router();

// Middleware para verificar se é super admin
const requireSuperAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  // Simplified auth check for demo
  const user = users.find(u => u.role === 'SUPER_ADMIN');
  if (!user) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  req.user = user;
  next();
};

// GET /api/admin/companies - Listar todas as empresas
router.get('/companies', requireSuperAdmin, (req, res) => {
  try {
    const companiesWithStats = companies.map(company => {
      const companyUsers = users.filter(u => u.companyId === company.id);
      const activeUsers = companyUsers.filter(u => u.role !== 'SUPER_ADMIN').length;
      
      // Cálculo de receita baseado no plano
      const planPrices = {
        STARTER: 50,
        PROFESSIONAL: 100,
        ENTERPRISE: 150
      };
      
      const monthlyRevenue = activeUsers * (planPrices[company.plan as keyof typeof planPrices] || 50);
      
      return {
        id: company.id,
        name: company.name,
        email: company.email,
        plan: company.plan,
        activeUsers,
        maxUsers: company.maxUsers,
        monthlyRevenue,
        status: company.active ? 'ACTIVE' : 'INACTIVE'
      };
    });
    
    res.json(companiesWithStats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

// POST /api/admin/users - Criar novo usuário
router.post('/users', requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role, companyId } = req.body;
    
    // Verificar se usuário já existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Verificar se empresa existe
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(400).json({ error: 'Empresa não encontrada' });
    }
    
    // Verificar limite de usuários
    const companyUsers = users.filter(u => u.companyId === companyId);
    if (companyUsers.length >= company.maxUsers) {
      return res.status(400).json({ error: 'Limite de usuários atingido' });
    }
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password: hashedPassword,
      role,
      companyId
    };
    
    users.push(newUser);
    
    res.status(201).json({ 
      message: 'Usuário criado com sucesso',
      user: { id: newUser.id, name, email, role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// GET /api/admin/billing - Relatório de faturamento
router.get('/billing', requireSuperAdmin, (req, res) => {
  try {
    const billingData = companies.map(company => {
      const companyUsers = users.filter(u => u.companyId === company.id && u.role !== 'SUPER_ADMIN');
      const planPrices = { STARTER: 50, PROFESSIONAL: 100, ENTERPRISE: 150 };
      const monthlyRevenue = companyUsers.length * (planPrices[company.plan as keyof typeof planPrices] || 50);
      
      return {
        companyId: company.id,
        companyName: company.name,
        plan: company.plan,
        activeUsers: companyUsers.length,
        monthlyRevenue,
        annualRevenue: monthlyRevenue * 12
      };
    });
    
    const totalMonthly = billingData.reduce((acc, b) => acc + b.monthlyRevenue, 0);
    const totalAnnual = totalMonthly * 12;
    
    res.json({
      companies: billingData,
      summary: {
        totalCompanies: companies.length,
        totalUsers: users.filter(u => u.role !== 'SUPER_ADMIN').length,
        monthlyRevenue: totalMonthly,
        annualRevenue: totalAnnual,
        averageRevenuePerCompany: totalMonthly / companies.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

export default router;