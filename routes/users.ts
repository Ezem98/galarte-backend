import { Router } from 'express'
import { UserController } from '../controllers/user.ts'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAll)

usersRouter.get('/:username', UserController.getByUsername)

usersRouter.post('/', UserController.create)

usersRouter.patch('/:username', UserController.update)

usersRouter.delete('/:username', UserController.delete)
