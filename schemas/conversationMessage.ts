import z from 'zod'
import { IConversationMessage } from '../types/conversationMessage.ts'

export const conversationMessageSchema = z.object({
    message: z.string(),
    sender: z.string(),
    conversation_id: z.number().positive().int(),
})

export const validConversationMessageData = (
    conversationMessageData: IConversationMessage
) => {
    return conversationMessageSchema.safeParse(conversationMessageData)
}

export const validPartialConversationMessageData = (
    conversationMessageData: IConversationMessage
) => {
    return conversationMessageSchema
        .partial()
        .safeParse(conversationMessageData)
}
