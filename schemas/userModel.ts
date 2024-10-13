import z from 'zod'
import { IUserModel } from '../types/userModel.ts'
import { guideSchema } from './guide.ts'

export const userModelSchema = z.object({
    userId: z.number().positive(),
    modelId: z.number().positive(),
    completed: z.number().int().min(0).max(1).default(0),
    currentStep: z.number().positive().default(1),
    guide: guideSchema,
})

export const validUserModelData = (userModelData: IUserModel) => {
    return userModelSchema.safeParse(userModelData)
}

export const validPartialUserModelData = (userModelData: IUserModel) => {
    return userModelSchema.partial().safeParse(userModelData)
}
