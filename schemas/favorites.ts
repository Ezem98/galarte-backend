import z from 'zod'
import { IFavorite } from '../types/favorite.ts'

export const favoriteSchema = z.object({
    user_id: z.number().positive(),
    model_id: z.number().positive(),
})

export const validFavoriteData = (favoriteData: IFavorite) => {
    return favoriteSchema.safeParse(favoriteData)
}

export const validPartialFavoriteData = (favoriteData: IFavorite) => {
    return favoriteSchema.partial().safeParse(favoriteData)
}
