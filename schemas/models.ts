import z from 'zod'
import { IModel } from '../types/model.ts'

export const modelSchema = z.object({
    name: z.string().min(6, 'Model name must be at least 6 characters'),
    description: z
        .string()
        .min(10, 'Model description must be at least 10 characters'),
    data: z.string(),
    image: z.string(),
    difficultyRating: z.number().positive(),
})

export const validModelData = (modelData: IModel) => {
    return modelSchema.safeParse(modelData)
}

export const validPartialModelData = (modelData: IModel) => {
    return modelSchema.partial().safeParse(modelData)
}
