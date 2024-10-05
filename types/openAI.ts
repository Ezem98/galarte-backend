import { Categories } from '../enums/categories.ts'
import { ExperienceLevel } from '../enums/experienceLevel.ts'

export interface IOpenAI {
    modelCategory: Categories
    modelName: string
    modelSize: {
        height: number
        width: number
    }
    experienceLevel: ExperienceLevel
}
