import { Router } from 'express'
import { UserModelController } from '../controllers/userModel.ts'

export const userModelsRouter = Router()

userModelsRouter.get('/user/:userId', UserModelController.getAllByUserId)
userModelsRouter.get('/model/:modelId', UserModelController.getAllByModelId)
userModelsRouter.get('/:userId/:modelId', UserModelController.get)

userModelsRouter.post('/', UserModelController.create)

userModelsRouter.patch('/:userId/:modelId', UserModelController.update)

userModelsRouter.delete('/:userId/:modelId', UserModelController.delete)
