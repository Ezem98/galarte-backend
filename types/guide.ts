import { IStep } from './step'

export interface IGuide {
    titulo: string
    explicacion: string
    pasos: IStep[]
}
