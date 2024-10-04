import { IUserModel } from '../types/userModel.ts'
import { db } from '../utils/consts.ts'

export class UserModelModel {
    static async getAllByUserId(userId: number) {
        try {
            const models = (
                await db.execute({
                    sql: 'SELECT * FROM user_models WHERE user_id = ?',
                    args: [userId],
                })
            ).rows

            if (!models.length)
                return {
                    successfully: false,
                    message: 'No models found for user with that id',
                }

            return {
                successfully: true,
                message: 'Models found',
                data: models,
            }
        } catch (error: any) {
            if (
                error.message ===
                'SQLITE_UNKNOWN: SQLite error: no such table: user_models'
            )
                return {
                    successfully: true,
                    message: 'No model found for this user id',
                }

            return { successfully: false, message: error.message }
        }
    }

    static async getAllByModelId(modelId: number) {
        try {
            const models = (
                await db.execute({
                    sql: 'SELECT * FROM user_models WHERE model_id = ?',
                    args: [modelId],
                })
            ).rows

            if (!models.length)
                return {
                    successfully: true,
                    message: 'Models not found for model with that id',
                }

            return {
                successfully: true,
                message: 'Models found',
                data: models,
            }
        } catch (error: any) {
            if (
                error.message ===
                'SQLITE_UNKNOWN: SQLite error: no such table: user_models'
            )
                return {
                    successfully: true,
                    message: 'No model found for this user id',
                }

            return { successfully: false, message: error.message }
        }
    }

    static async get(userId: number, modelId: number) {
        try {
            const userModel = (
                await db.execute({
                    sql: `SELECT * FROM user_models WHERE user_id = ? AND model_id = ?`,
                    args: [userId, modelId],
                })
            ).rows[0]

            if (!userModel)
                return {
                    successfully: true,
                    message: 'User Model not found',
                }

            return {
                successfully: true,
                message: 'User Model found',
                data: userModel,
            }
        } catch (error: any) {
            if (
                error.message ===
                'SQLITE_UNKNOWN: SQLite error: no such table: user_models'
            )
                return {
                    successfully: true,
                    message: 'No model found for this user id',
                }
            return {
                successfully: false,
                message: error.message,
            }
        }
    }

    static async create(newUserModel: IUserModel) {
        try {
            const { userId, modelId, completed, currentStep, guide } =
                newUserModel

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS user_models (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                user_id INTEGER NOT NULL,
                                model_id INTEGER NOT NULL,
                                completed BOOLEAN DEFAULT FALSE,
                                current_step INTEGER DEFAULT 0,
                                guide TEXT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                UNIQUE(user_id, model_id),
                                FOREIGN KEY (user_id) REFERENCES users(id),
                                FOREIGN KEY (model_id) REFERENCES models(id)
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO user_models (user_id, model_id, completed, current_step, guide) VALUES
                            (?, ?, ?, ?, ?);
                        `,
                        args: [
                            userId,
                            modelId,
                            completed,
                            currentStep,
                            JSON.stringify(guide),
                        ],
                    },
                ],

                'write'
            )

            const userModel = (
                await db.execute({
                    sql: 'SELECT * FROM user_models WHERE user_id = ? AND model_id = ?',
                    args: [userId, modelId],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'User Model created',
                data: userModel,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async update(
        userId: number,
        modelId: number,
        partialUserModel: Partial<IUserModel>
    ) {
        const { completed, currentStep } = partialUserModel

        try {
            const currentUserModel = (
                await db.execute({
                    sql: 'SELECT * FROM user_models WHERE user_id = ? AND model_id = ?',
                    args: [userId, modelId],
                })
            ).rows[0]

            await db.batch(
                [
                    {
                        sql: `UPDATE user_models
                        SET completed = ?,
                            current_step = ?
                        WHERE
                            user_id = ?;`,
                        args: [
                            completed ?? currentUserModel.completed,
                            currentStep ?? currentUserModel.currentStep,
                            userId,
                        ],
                    },
                ],
                'write'
            )

            const updatedUserModel = (
                await db.execute({
                    sql: 'SELECT * FROM user_models WHERE user_id = ? AND model_id = ?',
                    args: [userId, modelId],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'User Model updated',
                data: updatedUserModel,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async delete(userId: number, modelId: number) {
        try {
            await db.execute({
                sql: 'DELETE FROM user_models WHERE user_id = ? AND model_id = ?',
                args: [userId, modelId],
            })

            return { successfully: true, message: 'Model deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
