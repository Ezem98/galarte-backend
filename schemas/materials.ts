import z from 'zod'

export const materialsSchema = z.object({
    material: z.string(),
    cantidad: z.number().int().positive(),
    finalidad: z.string(),
})
