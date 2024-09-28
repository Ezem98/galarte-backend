import { db } from '../turso.ts'
import { IModel } from '../types/model.ts'
import { CloudinaryModel } from './cloudinary.ts'

export class ModelModel {
    static async getAll() {
        try {
            const models = (await db.execute('SELECT * FROM models')).rows

            if (!models.length)
                return {
                    successfully: false,
                    message: 'No models found',
                }

            return {
                successfully: true,
                message: 'Models found',
                data: models,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async getById(id: number) {
        try {
            const model = (
                await db.execute({
                    sql: 'SELECT * FROM models WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            if (!model)
                return {
                    successfully: false,
                    message: 'Model not found',
                }

            return {
                successfully: true,
                message: 'Model found',
                data: model,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async create(newModel: IModel) {
        try {
            const { name, description, data, difficultyRating, image } =
                newModel

            const modelDataUrl = await CloudinaryModel.uploadImage(
                data,
                `${name}-model-data`
            )

            const imageUrl = await CloudinaryModel.uploadImage(
                image,
                `${name}-model-image`
            )

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS models (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                description TEXT,
                                model_data TEXT NOT NULL,
                                model_image TEXT NOT NULL,
                                difficulty_rating INTEGER,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO models (name, description, model_data, model_image, difficulty_rating) VALUES
                            (?, ?, ?, ?);
                        `,
                        args: [
                            name,
                            description ?? null,
                            modelDataUrl,
                            imageUrl,
                            difficultyRating ?? null,
                        ],
                    },
                ],

                'write'
            )

            const model = (
                await db.execute({
                    sql: 'SELECT * FROM models WHERE name = ?',
                    args: [name],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Model created',
                data: model,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async update(id: number, partialUser: Partial<IModel>) {
        const { name, description, data, image, difficultyRating } = partialUser

        let hash: string | undefined, salt: string | undefined

        let modelDataUrl: string | undefined, imageUrl: string | undefined

        if (data)
            modelDataUrl = await CloudinaryModel.uploadImage(
                data,
                `${name}-model-data`
            )

        if (image)
            imageUrl = await CloudinaryModel.uploadImage(
                image,
                `${name}-model-image`
            )

        try {
            const currentModel = (
                await db.execute({
                    sql: 'SELECT * FROM models WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            await db.batch(
                [
                    {
                        sql: `UPDATE models
                        SET name = ?,
                            description = ?,
                            data = ?,
                            image = ?,
                            difficulty_rating = ?
                        WHERE
                            id = ?;`,
                        args: [
                            name ?? currentModel.model,
                            description ?? currentModel.description,
                            data ?? currentModel.data,
                            image ?? currentModel.image,
                            difficultyRating ?? currentModel.difficultyRating,
                            id,
                        ],
                    },
                ],
                'write'
            )

            const updatedModel = (
                await db.execute({
                    sql: 'SELECT * FROM models WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Model updated',
                data: updatedModel,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async delete(id: number) {
        try {
            await db.execute({
                sql: 'DELETE FROM models WHERE id = ?',
                args: [id],
            })

            return { successfully: true, message: 'Model deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
