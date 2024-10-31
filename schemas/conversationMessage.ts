import z from 'zod'
import { IConversationMessage } from '../types/conversationMessage.ts'
import { IConversationMessageList } from '../types/conversationMessageList.ts'

export const conversationMessageSchema = z.object({
    message: z.string(),
    sender: z.string(),
    conversation_id: z.number().positive().int(),
})

export const conversationMessageListSchema = z.object({
    messages: z.array(conversationMessageSchema),
    conversation_id: z.number().positive().int(),
})

export const validConversationMessageListData = (
    conversationMessageListData: IConversationMessageList
) => {
    return conversationMessageListSchema.safeParse(conversationMessageListData)
}

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
