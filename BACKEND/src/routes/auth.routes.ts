import { Router } from 'express';
import { register, login, refreshAccessToken, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validation';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
