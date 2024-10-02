import z from 'zod'

export const stepSchema = z.object({
    paso: z.number().positive(),
    titulo: z.string(),
    descripcion: z.string(),
})
