import z from 'zod'
import { IUserModel } from '../types/userModel.ts'
import { guideSchema } from './guide.ts'

export const userModelSchema = z.object({
    userId: z.number().positive(),
    modelId: z.number().positive(),
    completed: z.boolean().default(false),
    currentStep: z.number().positive().default(1),
    guide: guideSchema,
    data: z.string(),
    image: z.string(),
})

export const validUserModelData = (userModelData: IUserModel) => {
    return userModelSchema.safeParse(userModelData)
}

export const validPartialUserModelData = (userModelData: IUserModel) => {
    return userModelSchema.partial().safeParse(userModelData)
}
