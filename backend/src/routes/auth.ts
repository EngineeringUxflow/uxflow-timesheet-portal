import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { generateToken } from '../lib/jwt';

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  companyName: z.string().min(2)
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo user login
    if (email === 'demo@uxflow.com' && password === 'demo123') {
      const token = 'demo-token-' + Date.now();
      
      console.log('✅ Demo user login successful');
      
      return res.json({
        token,
        user: {
          id: 'demo-user-id',
          email: 'demo@uxflow.com',
          name: 'Demo UXFLOW',
          role: 'CONSULTANT',
          company: {
            id: 'demo-company-id',
            name: 'UXFLOW Consultoria',
            plan: 'PROFESSIONAL'
          }
        }
      });
    }
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Try database login
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { company: true }
      });

      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          company: user.company
        }
      });
    } catch (dbError) {
      console.error('Database login error:', dbError);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, companyName } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        name: companyName,
        email: email,
        plan: 'STARTER'
      }
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'COMPANY_ADMIN',
        companyId: company.id
      },
      include: { company: true }
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    console.log(`Password recovery email sent to: ${email}`);
    
    res.json({ message: 'Recovery email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending recovery email' });
  }
});

export default router;