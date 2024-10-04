import { Router } from 'express'
import { AuthController } from '../controllers/auth.ts'

export const authRouter = Router()

authRouter.post('/login', AuthController.login)
