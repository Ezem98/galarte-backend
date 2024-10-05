import { IFavorite } from '../types/favorite.ts'
import { db } from '../utils/consts.ts'

export class FavoriteModel {
    static async create(newFavorite: IFavorite) {
        try {
            const { user_id, model_id } = newFavorite

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS favorites (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id INTEGER NOT NULL,
                                model_id INTEGER NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                UNIQUE(user_id, model_id),
                                FOREIGN KEY (user_id) REFERENCES users(id),
                                FOREIGN KEY (model_id) REFERENCES models(id)
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO favorites (user_id, model_id) VALUES
                            (?, ?);
                        `,
                        args: [user_id, model_id],
                    },
                ],

                'write'
            )

            const favorite = (
                await db.execute({
                    sql: 'SELECT * FROM favorites WHERE user_id = ? AND model_id = ?',
                    args: [user_id, model_id],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Favorite created',
                data: favorite,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async delete(userId: string, modelId: string) {
        try {
            await db.execute({
                sql: 'DELETE FROM favorites WHERE user_id = ? AND model_id = ?',
                args: [userId, modelId],
            })

            return { successfully: true, message: 'Favorite deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
