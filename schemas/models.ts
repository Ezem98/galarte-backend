import z from 'zod'
import { Categories } from '../enums/categories.ts'
import { IModel } from '../types/model.ts'

export const modelSchema = z.object({
    name: z.string().min(6, 'Model name must be at least 6 characters'),
    description: z
        .string()
        .min(10, 'Model description must be at least 10 characters'),
    data: z.string(),
    image: z.string(),
    difficulty_rating: z.number().positive(),
    category_id: z
        .number()
        .int()
        .min(Categories.Roof, 'Category ID must be at least 1')
        .max(Categories.Foundation, 'Category ID must be at most 5'),
    width: z.number().positive(),
    height: z.number().positive(),
    position: z.enum(['horizontal', 'vertical']),
})

export const validModelData = (modelData: IModel) => {
    return modelSchema.safeParse(modelData)
}

export const validPartialModelData = (modelData: IModel) => {
    return modelSchema.partial().safeParse(modelData)
}
