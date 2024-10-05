import { Router } from 'express'
import { FavoriteController } from '../controllers/favorites.ts'

export const favoritesRouter = Router()

favoritesRouter.post('/', FavoriteController.create)

favoritesRouter.delete('/:id', FavoriteController.delete)
