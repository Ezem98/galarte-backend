import { Router } from 'express'
import { ArtistController } from '../controllers/artist.ts'

export const artistsRouter = Router()

artistsRouter.get('/', ArtistController.getAll)
artistsRouter.get('/:id', ArtistController.get)

artistsRouter.post('/', ArtistController.create)

artistsRouter.patch('/:id', ArtistController.update)

artistsRouter.delete('/:id', ArtistController.delete)
