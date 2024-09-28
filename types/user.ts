import { ExperienceLevel } from '../enums/experienceLevel.ts'

export interface IUser {
    id?: number
    username: string
    email: string
    password: string
    passwordSalt: string
    experienceLevel: ExperienceLevel
    image?: string
    createdAt?: string
    updatedAt?: string
}
