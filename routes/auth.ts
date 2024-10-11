import { Router } from 'express'
import passport from 'passport'
import { AuthController } from '../controllers/auth.ts'

export const authRouter = Router()

authRouter.post('/login', AuthController.login)
authRouter.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    AuthController.google
)
