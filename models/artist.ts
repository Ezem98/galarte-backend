import { IArtist } from '../types/artist.ts'
import { db } from '../utils/consts.ts'
import { CloudinaryModel } from './cloudinary.ts'

export class ArtistModel {
    static async getAll() {
        try {
            const artists = (await db.execute('SELECT * FROM artists')).rows

            if (!artists.length)
                return {
                    successfully: false,
                    message: 'No artists found',
                }

            return {
                successfully: true,
                message: 'Artists found',
                data: artists,
            }
        } catch (error: any) {
            if (
                error.message ===
                'SQLITE_UNKNOWN: SQLite error: no such table: artists'
            )
                return {
                    successfully: true,
                    message: 'No artists found',
                }

            return { successfully: false, message: error.message }
        }
    }

    static async get(id: number) {
        try {
            const artist = (
                await db.execute({
                    sql: `SELECT * FROM artists WHERE id = ?`,
                    args: [id],
                })
            ).rows[0]

            if (!artist)
                return {
                    successfully: true,
                    message: 'Artist not found',
                }

            return {
                successfully: true,
                message: 'Artist found',
                data: artist,
            }
        } catch (error: any) {
            if (
                error.message ===
                'SQLITE_UNKNOWN: SQLite error: no such table: artists'
            )
                return {
                    successfully: true,
                    message: 'No artist found for this id',
                }
            return {
                successfully: false,
                message: error.message,
            }
        }
    }

    static async create(newArtist: IArtist) {
        try {
            const {
                name,
                lastname,
                address,
                description,
                dateOfBirth,
                technique,
                nationality,
                image,
                documentType,
                document,
            } = newArtist

            const imageUrl = await CloudinaryModel.uploadImage(
                image,
                `${name}-artist-image`,
                'galarte/artists'
            )

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS artists (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                lastname TEXT NOT NULL,
                                address TEXT NOT NULL,
                                description TEXT NOT NULL,
                                dateOfBirth TEXT NOT NULL,
                                technique TEXT NOT NULL,
                                nationality TEXT NOT NULL,
                                image TEXT NOT NULL,
                                documentType TEXT NULL,
                                document TEXT NULL,
                                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO artists (name, lastname, address, description, dateOfBirth, technique, nationality, image, documentType, document) VALUES
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                        `,
                        args: [
                            name,
                            lastname,
                            address,
                            description,
                            dateOfBirth,
                            technique,
                            nationality,
                            imageUrl,
                            documentType ?? null,
                            document ?? null,
                        ],
                    },
                ],

                'write'
            )

            const artist = (
                await db.execute(
                    'SELECT TOP 1 * FROM artists ORDER BY createdAt DESC'
                )
            ).rows[0]

            return {
                successfully: true,
                message: 'Artist created',
                data: artist,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async update(id: number, partialArtist: Partial<IArtist>) {
        const {
            address,
            description,
            documentType,
            document,
            nationality,
            technique,
            image,
        } = partialArtist

        try {
            const currentArtist = (
                await db.execute({
                    sql: 'SELECT * FROM artists WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            let imageUrl = currentArtist.image

            if (image) {
                imageUrl = await CloudinaryModel.uploadImage(
                    image,
                    `${currentArtist.name}-artist-image`,
                    'galarte/artists'
                )
            }

            await db.batch(
                [
                    {
                        sql: `UPDATE artists
                        SET address = ?,
                            description = ?,
                            documentType = ?,
                            document = ?,
                            nationality = ?,
                            technique = ?,
                            image = ?
                        WHERE
                            id = ?;`,
                        args: [
                            address ?? currentArtist.address,
                            description ?? currentArtist.description,
                            documentType ?? currentArtist.documentType,
                            document ?? currentArtist.document,
                            nationality ?? currentArtist.nationality,
                            technique ?? currentArtist.technique,
                            imageUrl,
                            id,
                        ],
                    },
                ],
                'write'
            )

            const updatedArtist = (
                await db.execute({
                    sql: 'SELECT * FROM artists WHERE id = ?',
                    args: [id],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'Artist updated',
                data: updatedArtist,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async delete(id: number) {
        try {
            await db.execute({
                sql: 'DELETE FROM artists WHERE id = ?',
                args: [id],
            })

            return { successfully: true, message: 'Artist deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
