import { IConversationMessage } from './conversationMessage.ts'

export interface IConversationMessageList {
    messages: IConversationMessage[]
    conversation_id: number
}
