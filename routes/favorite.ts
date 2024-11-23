import { Router } from 'express'
import { FavoriteController } from '../controllers/favorite.ts'

export const favoritesRouter = Router()

favoritesRouter.post('/', FavoriteController.create)

favoritesRouter.get('/:userId/:modelId', FavoriteController.get)

favoritesRouter.delete('/:userId/:modelId', FavoriteController.delete)
