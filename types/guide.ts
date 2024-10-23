import { IMaterial } from './material.ts'
import { IStep } from './step.ts'

export interface IGuide {
    titulo: string
    explicacion: string
    pasos: IStep[]
    materiales: IMaterial[]
    tiempo_insumido: number
    costo: number
}
