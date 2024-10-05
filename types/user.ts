import { ExperienceLevel } from '../enums/experienceLevel.ts'

export interface IUser {
    id?: number
    name: string
    surname: string
    username: string
    email: string
    password: string
    password_salt: string
    experience_level: ExperienceLevel
    image?: string
    created_at?: string
    updated_at?: string
}
