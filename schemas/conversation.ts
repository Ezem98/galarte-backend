import z from 'zod'
import { IConversation } from '../types/conversation.ts'

export const conversationSchema = z.object({
    user_id: z.number().positive().int(),
})

export const validConversationData = (conversationData: IConversation) => {
    return conversationSchema.safeParse(conversationData)
}

export const validPartialConversationData = (
    conversationData: IConversation
) => {
    return conversationSchema.partial().safeParse(conversationData)
}
