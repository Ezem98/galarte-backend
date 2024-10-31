export interface IConversationMessage {
    id?: number
    message: string
    sender: string
    conversation_id: number
    created_at?: string
    updated_at?: string
}
