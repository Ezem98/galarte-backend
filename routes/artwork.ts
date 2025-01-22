import { Router } from 'express'
import { ArtworkController } from '../controllers/artwork.ts'

export const artworksRouter = Router()

artworksRouter.get('/', ArtworkController.getAll)

artworksRouter.get('/:id', ArtworkController.getById)

artworksRouter.get('/artist/:artistId', ArtworkController.getByArtistId)

artworksRouter.get('/search/:search', ArtworkController.getByName)

artworksRouter.post('/', ArtworkController.create)

artworksRouter.patch('/:id', ArtworkController.update)

artworksRouter.delete('/:id', ArtworkController.delete)
