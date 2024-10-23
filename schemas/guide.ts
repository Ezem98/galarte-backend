import z from 'zod'
import { materialsSchema } from './materials.ts'
import { stepSchema } from './step.ts'

export const guideSchema = z.object({
    titulo: z.string(),
    explicacion: z.string(),
    pasos: z.array(stepSchema),
    materiales: z.array(materialsSchema),
    tiempo_insumido: z.number().positive().int(),
    costo: z.number().positive(),
})
