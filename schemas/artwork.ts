import z from 'zod'
import { IArtwork } from '../types/artwork.ts'

export const artworkSchema = z.object({
    name: z.string().min(4, 'Artwork name must be at least 4 characters'),
    description: z
        .string()
        .min(10, 'Artwork description must be at least 10 characters'),
    code: z.string(),
    serialNumber: z.string(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    technique: z
        .string()
        .min(4, 'Artwork technique must be at least 4 characters'),
    framed: z.number().int().min(0).max(1).default(0),
    year: z.string().min(4, 'Artwork year must be at least 4 digits'),
    image: z.string(),
    artistId: z.number().int().positive(),
})

export const validArtworkData = (artworkData: IArtwork) => {
    return artworkSchema.safeParse(artworkData)
}

export const validPartialArtworkData = (artworkData: IArtwork) => {
    return artworkSchema.partial().safeParse(artworkData)
}
