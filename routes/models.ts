import { Router } from 'express'
import { ModelController } from '../controllers/models'

export const modelsRouter = Router()

modelsRouter.get('/', ModelController.getAll)

modelsRouter.get('/:id', ModelController.getById)

modelsRouter.post('/', ModelController.create)

modelsRouter.patch('/:id', ModelController.update)

modelsRouter.delete('/:id', ModelController.delete)
