import z from 'zod'

export const customerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    surname: z.string().min(2, 'Surname must be at least 2 characters'),
    username: z.string().min(6, 'Username must be at least 6 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
    image: z.string().optional(),
    completed_profile: z.number().int().min(0).max(1).default(0),
})

export const validUserData = (userData: any) => {
    return customerSchema.safeParse(userData)
}

export const updateCustomerSchema = z.object({
    username: z.string().min(6, 'Username must be at least 6 characters'),
    email: z.string().email('Invalid email format'),
    image: z.string().optional(),
    completed_profile: z.number().int().min(0).max(1),
})

export const validPartialUserData = (userData: any) => {
    return updateCustomerSchema.partial().safeParse(userData)
}

export const updatePasswordSchema = z.object({
    password: z.string(),
    newPassword: z
        .string()
        .min(8, 'New password must contain at least 8 characters'),
})

export const validUpdatePasswordData = (userData: any) => {
    return updatePasswordSchema.safeParse(userData)
}
