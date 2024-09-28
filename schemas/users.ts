import z from 'zod'
import { ExperienceLevel } from '../enums/experienceLevel.ts'
import { IUser } from '../types/user.ts'

export const userSchema = z.object({
    username: z.string().min(6, 'Username must be at least 6 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
    image: z.string().optional(),
    experienceLevel: z
        .number()
        .int()
        .min(ExperienceLevel.BEGINNER, 'Experience level must be at least 1')
        .max(ExperienceLevel.ADVANCED, 'Experience level must be at most 3'),
})

export const validUserData = (userData: IUser) => {
    return userSchema.safeParse(userData)
}

export const validPartialUserData = (userData: IUser) => {
    return userSchema.partial().safeParse(userData)
}
