import { ExperienceLevel } from '../enums/experienceLevel.ts'

export interface IOpenAI {
    modelName: string
    modelSize: {
        height: number
        width: number
    }
    experienceLevel: ExperienceLevel
}
