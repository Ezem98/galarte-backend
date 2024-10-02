import { IGuide } from './guide'

export interface IUserModel {
    id?: number
    userId: number
    modelId: number
    completed: boolean
    currentStep: number
    guide: IGuide
    createdAt?: string
    updatedAt?: string
}
