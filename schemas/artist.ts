import z from 'zod'
import { IArtist } from '../types/artist.ts'

export const artistSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    biography: z.string(),
    address: z.string(),
    dateOfBirth: z.string(),
    technique: z.string(),
    nationality: z.string(),
    image: z.string(),
    documentType: z.string().optional(),
    document: z.string().optional(),
})

export const validArtistData = (artistData: IArtist) => {
    return artistSchema.safeParse(artistData)
}

export const validPartialArtistData = (artistData: IArtist) => {
    return artistSchema.partial().safeParse(artistData)
}
