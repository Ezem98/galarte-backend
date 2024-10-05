import { IModel } from '../types/model.ts'
import { db } from '../utils/consts.ts'
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

    static async getByCategoryId(categoryId: number) {
        try {
            const models = (
                await db.execute({
                    sql: 'SELECT * FROM models WHERE category_id = ?',
                    args: [categoryId],
                })
            ).rows

            if (!models)
                return {
                    successfully: false,
                    message: 'Models not found for this category',
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

    static async getByName(name: string) {
        try {
            const models = (
                await db.execute({
                    sql: 'SELECT * FROM models WHERE LOWER(name) LIKE LOWER(?)',
                    args: [`%${name}%`],
                })
            ).rows

            if (!models)
                return {
                    successfully: true,
                    message: 'Models not found for this query',
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

    static async getByUserId(userId: string) {
        try {
            const models = (
                await db.execute({
                    sql: 'SELECT m.* FROM models m JOIN user_models  um ON m.id = um.model_id WHERE um.user_id = ?',
                    args: [userId],
                })
            ).rows

            if (!models)
                return {
                    successfully: true,
                    message: 'Models not found for this user id',
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

    static async create(newModel: IModel) {
        try {
            const {
                name,
                description,
                data,
                difficulty_rating,
                image,
                category_id,
            } = newModel

            // const modelDataUrl = await CloudinaryModel.uploadImage(
            //     data,
            //     `${name}-model-data`,
            //     'modelsData'
            // )

            const imageUrl = await CloudinaryModel.uploadImage(
                image,
                `${name}-model-image`,
                'modelsImages'
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
                                difficulty_rating INTEGER NOT NULL,
                                category_id INTEGER NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                FOREIGN KEY (category_id) REFERENCES categories(id)
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO models (name, description, model_data, model_image, difficulty_rating, category_id) VALUES
                            (?, ?, ?, ?, ?, ?);
                        `,
                        args: [
                            name,
                            description ?? null,
                            '',
                            imageUrl,
                            difficulty_rating ?? null,
                            category_id,
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

    static async update(id: number, partialModel: Partial<IModel>) {
        const { name, description, data, image, difficulty_rating } =
            partialModel

        let modelDataUrl: string | undefined, imageUrl: string | undefined

        if (data)
            modelDataUrl = await CloudinaryModel.uploadImage(
                data,
                `${name}-model-data`,
                'modelsData'
            )

        if (image)
            imageUrl = await CloudinaryModel.uploadImage(
                image,
                `${name}-model-image`,
                'modelsImages'
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
                            modelDataUrl ?? currentModel.data,
                            imageUrl ?? currentModel.image,
                            difficulty_rating ?? currentModel.difficultyRating,
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
