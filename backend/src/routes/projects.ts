import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getProjects, createProject } from '../controllers/projectController';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', createProject);

export default router;