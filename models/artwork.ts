import { IArtwork } from '../types/artwork.ts'
import { db } from '../utils/consts.ts'
import { CloudinaryModel } from './cloudinary.ts'

export class ArtworkModel {
    static async getAll(limit?: number) {
        try {
            let artworks = []
            if (limit)
                artworks = (
                    await db.execute({
                        sql: 'SELECT * FROM artworks LIMIT ?',
                        args: [limit],
                    })
                ).rows
            else artworks = (await db.execute('SELECT * FROM artworks')).rows

            if (!artworks.length)
                return {
                    successfully: false,
                    message: 'No artworks found',
                }

            return {
                successfully: true,
                message: 'Artworks found',
                data: artworks,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async getById(id: number) {
        try {
            const artwork = (
                await db.execute({
                    sql: 'SELECT * FROM artworks WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            if (!artwork)
                return {
                    successfully: false,
                    message: 'Artwork not found',
                }

            return {
                successfully: true,
                message: 'Artwork found',
                data: artwork,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async getByArtistId(artistId: number, limit?: number) {
        try {
            let artworks = []
            if (limit)
                artworks = (
                    await db.execute({
                        sql: 'SELECT * FROM artworks WHERE artistId = ? LIMIT ?',
                        args: [artistId, limit],
                    })
                ).rows
            else
                artworks = (
                    await db.execute({
                        sql: 'SELECT * FROM artworks WHERE artistId = ?',
                        args: [artistId],
                    })
                ).rows

            if (!artworks)
                return {
                    successfully: false,
                    message: 'Artworks not found for this artist',
                }

            return {
                successfully: true,
                message: 'Artworks found',
                data: artworks,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async getByName(name: string) {
        try {
            const artworks = (
                await db.execute({
                    sql: 'SELECT * FROM artworks WHERE LOWER(name) LIKE LOWER(?)',
                    args: [`%${name}%`],
                })
            ).rows

            if (!artworks)
                return {
                    successfully: true,
                    message: 'Artworks not found for this query',
                }

            return {
                successfully: true,
                message: 'Artworks found',
                data: artworks,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async create(newArtwork: IArtwork) {
        try {
            const {
                name,
                description,
                code,
                serialNumber,
                width,
                height,
                length,
                technique,
                framed,
                year,
                image,
                artistId,
                price,
                isUnique,
            } = newArtwork

            const imageUrl = await CloudinaryModel.uploadImage(
                image,
                `${name}-artwork-image`,
                '/artworks'
            )

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS artworks (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                description TEXT,
                                code TEXT NOT NULL,
                                serialNumber TEXT NOT NULL,
                                width INTEGER NOT NULL,
                                height INTEGER NOT NULL,
                                length INTEGER NOT NULL,
                                technique TEXT NOT NULL,
                                framed INTEGER NOT NULL,
                                year TEXT NOT NULL,
                                image TEXT NOT NULL,
                                artistId INTEGER NOT NULL,
                                price INTEGER NOT NULL,
                                isUnique INTEGER NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                FOREIGN KEY (artistId) REFERENCES artists(id),
                                UNIQUE(code, serialNumber, artistId)
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO artworks (name, description, code, serialNumber, width, height, length, technique, framed, year, image, artistId, price, isUnique) VALUES
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                        `,
                        args: [
                            name,
                            description ?? '',
                            code,
                            serialNumber,
                            width,
                            height,
                            length ?? 0,
                            technique,
                            framed,
                            year,
                            imageUrl,
                            artistId,
                            price,
                            isUnique,
                        ],
                    },
                ],

                'write'
            )

            const artwork = (
                await db.execute(
                    'SELECT TOP 1 * FROM artworks ORDER BY createdAt DESC'
                )
            ).rows[0]

            return {
                successfully: true,
                message: 'Artwork created',
                data: artwork,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async update(id: number, partialArtwork: Partial<IArtwork>) {
        const {
            name,
            description,
            width,
            height,
            length,
            technique,
            year,
            framed,
            image,
        } = partialArtwork

        try {
            const currentArtwork = (
                await db.execute({
                    sql: 'SELECT * FROM artworks WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            let imageUrl = currentArtwork.image

            if (image)
                imageUrl = await CloudinaryModel.uploadImage(
                    image,
                    `${name}-artwork-image`,
                    '/artworks'
                )

            await db.batch(
                [
                    {
                        sql: `UPDATE models
                        SET name = ?,
                            description = ?,
                            width = ?,
                            height = ?,
                            length = ?,
                            technique = ?,
                            framed = ?,
                            year = ?,
                            image = ?,
                        WHERE
                            id = ?;`,
                        args: [
                            name ?? currentArtwork.model,
                            description ?? currentArtwork.description,
                            width ?? currentArtwork.data,
                            height ?? currentArtwork.difficultyRating,
                            length ?? currentArtwork.length,
                            technique ?? currentArtwork.technique,
                            framed ?? currentArtwork.framed,
                            year ?? currentArtwork.year,
                            imageUrl ?? currentArtwork.image,
                            id,
                        ],
                    },
                ],
                'write'
            )

            const updatedArtwork = (
                await db.execute({
                    sql: 'SELECT * FROM artworks WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Artwork updated',
                data: updatedArtwork,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async delete(id: number) {
        try {
            await db.execute({
                sql: 'DELETE FROM artworks WHERE id = ?',
                args: [id],
            })

            return { successfully: true, message: 'Artwork deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
