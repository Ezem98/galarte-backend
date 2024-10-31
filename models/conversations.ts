import { IConversation } from '../types/conversation.ts'
import { db } from '../utils/consts.ts'

export class ConversationModel {
    static async create(newConversation: IConversation) {
        try {
            const { user_id } = newConversation

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS conversations (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id INTEGER NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                UNIQUE(id, user_id),
                                FOREIGN KEY (user_id) REFERENCES users(id)
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO conversations (user_id) VALUES
                            (?);
                        `,
                        args: [user_id],
                    },
                ],

                'write'
            )

            const conversation = (
                await db.execute({
                    sql: 'SELECT * FROM conversations WHERE user_id = ?',
                    args: [user_id],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Conversation created',
                data: conversation,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async get(id: number) {
        try {
            const conversation = (
                await db.execute({
                    sql: `SELECT * FROM conversations WHERE id = ?`,
                    args: [id],
                })
            ).rows[0]

            if (!conversation)
                return {
                    successfully: true,
                    message: 'Conversation not found',
                }

            return {
                successfully: true,
                message: 'Conversation found',
                data: conversation,
            }
        } catch (error: any) {
            return {
                successfully: false,
                message: 'Error getting conversation',
            }
        }
    }

    static async getAllByUserId(userId: number) {
        try {
            const conversations = (
                await db.execute({
                    sql: `SELECT * FROM conversations WHERE user_id = ?`,
                    args: [userId],
                })
            ).rows

            if (!conversations)
                return {
                    successfully: true,
                    message: 'Conversations not found',
                }

            return {
                successfully: true,
                message: 'Conversations found',
                data: conversations,
            }
        } catch (error: any) {
            return {
                successfully: false,
                message: 'Error getting conversations',
            }
        }
    }

    static async delete(id: number) {
        try {
            await db.execute({
                sql: 'DELETE FROM conversations WHERE id = ?',
                args: [id],
            })

            return { successfully: true, message: 'Conversation deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
