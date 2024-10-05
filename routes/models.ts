import { Router } from 'express'
import { ModelController } from '../controllers/models.ts'

export const modelsRouter = Router()

modelsRouter.get('/', ModelController.getAll)

modelsRouter.get('/:id', ModelController.getById)

modelsRouter.get('/category/:categoryId', ModelController.getByCategoryId)

modelsRouter.get('/search/:search', ModelController.getByName)

modelsRouter.get('/user/:userId', ModelController.getByUserId)

modelsRouter.get('/favorite/:userId', ModelController.getFavorites)

modelsRouter.post('/', ModelController.create)

modelsRouter.patch('/:id', ModelController.update)

modelsRouter.delete('/:id', ModelController.delete)
