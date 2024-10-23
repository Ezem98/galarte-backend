import z from 'zod'

export const materialsSchema = z.object({
    material: z.string(),
    cantidad: z.string(),
    finalidad: z.string(),
})
