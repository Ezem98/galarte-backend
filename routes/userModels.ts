import { Router } from 'express'
import { ModelController } from '../controllers/models.ts'

export const userModelsRouter = Router()

userModelsRouter.get('/:userId', ModelController.getAll)
userModelsRouter.get('/:modelId', ModelController.getById)
userModelsRouter.get('/:userId/:modelId', ModelController.getById)

userModelsRouter.post('/', ModelController.create)

userModelsRouter.patch('/:userId/:modelId', ModelController.update)

userModelsRouter.delete('/:userId/:modelId', ModelController.delete)
