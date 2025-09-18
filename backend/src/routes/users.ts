import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getUsers, createUser } from '../controllers/userController';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.post('/', createUser);

export default router;