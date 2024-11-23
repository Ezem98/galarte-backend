import { Router } from 'express'
import { ArtistController } from '../controllers/artist.ts'

export const artistsRouter = Router()

artistsRouter.get('/user/:userId', ArtistController.getAll)
artistsRouter.get('/:userId/:modelId', ArtistController.get)

artistsRouter.post('/', ArtistController.create)

artistsRouter.patch('/:id', ArtistController.update)

artistsRouter.delete('/:userId/:modelId', ArtistController.delete)
