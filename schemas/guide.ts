import z from 'zod'
import { stepSchema } from './step'

export const guideSchema = z.object({
    titulo: z.string(),
    explicacion: z.string(),
    pasos: z.array(stepSchema),
})
