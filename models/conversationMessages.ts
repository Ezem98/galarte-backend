import { IConversationMessage } from '../types/conversationMessage.ts'
import { db } from '../utils/consts.ts'

export class ConversationMessageModel {
    static async create(newConversationMessage: IConversationMessage) {
        try {
            const { conversation_id, message, sender } = newConversationMessage

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS conversation_messages (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                conversation_id INTEGER NOT NULL,
                                message TEXT NOT NULL,
                                sender TEXT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO conversation_messages (conversation_id, message, sender) VALUES
                            (?, ?, ?);
                        `,
                        args: [conversation_id, message, sender],
                    },
                ],

                'write'
            )

            const conversationMessage = (
                await db.execute({
                    sql: 'SELECT * FROM conversation_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 1',
                    args: [conversation_id],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Conversation message created',
                data: conversationMessage,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async get(id: number) {
        try {
            const conversationMessage = (
                await db.execute({
                    sql: `SELECT * FROM conversation_message WHERE id = ?`,
                    args: [id],
                })
            ).rows[0]

            if (!conversationMessage)
                return {
                    successfully: true,
                    message: 'Conversation message not found',
                }

            return {
                successfully: true,
                message: 'Conversation message found',
                data: conversationMessage,
            }
        } catch (error: any) {
            return {
                successfully: false,
                message: 'Error getting conversation message',
            }
        }
    }

    static async getAllByConversationId(conversationId: number) {
        try {
            const conversationMessages = (
                await db.execute({
                    sql: `SELECT * FROM conversation_messages WHERE conversation_id = ? ORDER BY created_at ASC`,
                    args: [conversationId],
                })
            ).rows

            if (!conversationMessages)
                return {
                    successfully: true,
                    message: 'Conversation messages not found',
                }

            return {
                successfully: true,
                message: 'Conversation messages found',
                data: conversationMessages,
            }
        } catch (error: any) {
            return {
                successfully: false,
                message: 'Error getting conversation messages',
            }
        }
    }

    static async delete(id: number) {
        try {
            await db.execute({
                sql: 'DELETE FROM conversation_message WHERE id = ?',
                args: [id],
            })

            return {
                successfully: true,
                message: 'Conversation message deleted',
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
