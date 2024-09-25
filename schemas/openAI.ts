import z from 'zod'
import { ExperienceLevel } from '../enums/experienceLevel.ts'
import { IOpenAI } from '../types/openAI.ts'

export const openAISchema = z.object({
    modelCategory: z.enum([
        'wall',
        'roof',
        'floor',
        'open',
        'foundation',
        'repair',
    ]),
    modelName: z.string(), //cambiar por el id quizás
    modelSize: z.object({
        height: z.number().int().positive(),
        width: z.number().int().positive(),
    }),
    experienceLevel: z
        .number()
        .int()
        .min(ExperienceLevel.BEGINNER, 'Experience level must be at least 1')
        .max(ExperienceLevel.ADVANCED, 'Experience level must be at most 3'),
})

export const validOpenAIData = (openAIData: IOpenAI) => {
    return openAISchema.safeParse(openAIData)
}
