import z from 'zod'
import { IArtist } from '../types/artist.ts'

export const artistSchema = z.object({
    name: z.string(),
    lastname: z.string(),
    description: z.string(),
    address: z.string(),
    dateOfBirth: z.string(),
    technique: z.string(),
    nationality: z.string(),
    image: z.string(),
    documentType: z.string(),
    document: z.string(),
})

export const validArtistData = (artistData: IArtist) => {
    return artistSchema.safeParse(artistData)
}

export const validPartialArtistData = (artistData: IArtist) => {
    return artistSchema.partial().safeParse(artistData)
}
