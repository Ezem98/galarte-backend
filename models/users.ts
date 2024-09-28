import { CloudinaryModel } from '../models/cloudinary.ts'
import { db } from '../turso.ts'
import { IUser } from '../types/user.ts'
import { generatePassword } from '../utils/functions.ts'

export class UserModel {
    static async getAll() {
        try {
            const users = (await db.execute('SELECT * FROM users')).rows

            if (!users.length)
                return {
                    successfully: false,
                    message: 'No users found',
                }

            return {
                successfully: true,
                message: 'Users found',
                data: users,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async getByUsername(username: string) {
        try {
            const user = (
                await db.execute({
                    sql: 'SELECT * FROM users WHERE username = ?',
                    args: [username],
                })
            ).rows[0]

            if (!user)
                return {
                    successfully: false,
                    message: 'User not found',
                }

            return {
                successfully: true,
                message: 'User found',
                data: user,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async create(newUser: Omit<IUser, 'passwordSalt'>) {
        try {
            const { username, email, password, experienceLevel, image } =
                newUser

            const { hash, salt } = generatePassword(password)

            let imageUrl: string | undefined

            if (image)
                imageUrl = await CloudinaryModel.uploadImage(
                    image,
                    `${username}-profile-image`
                )

            await db.batch(
                [
                    `
                            CREATE TABLE IF NOT EXISTS users (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                username TEXT NOT NULL UNIQUE,
                                email TEXT NOT NULL UNIQUE,
                                password TEXT NOT NULL,
                                password_salt TEXT NOT NULL,
                                image TEXT,
                                experience_level INTEGER,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                            );
                        `,
                    {
                        sql: `
                            INSERT INTO users (username, email, password, password_salt, image, experience_level) VALUES
                            (?, ?, ?, ?);
                        `,
                        args: [
                            username,
                            email,
                            hash,
                            salt,
                            imageUrl ?? null,
                            experienceLevel,
                        ],
                    },
                ],

                'write'
            )

            const user = (
                await db.execute({
                    sql: 'SELECT * FROM users WHERE username = ?',
                    args: [username],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'User created',
                data: user,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async update(currentUserName: string, partialUser: Partial<IUser>) {
        const { username, email, password, experienceLevel } = partialUser

        let hash: string | undefined, salt: string | undefined

        if (password) {
            const result = generatePassword(password)
            hash = result.hash
            salt = result.salt
        }

        try {
            const currentUser = (
                await db.execute({
                    sql: 'SELECT * FROM users WHERE username = ?',
                    args: [currentUserName],
                })
            ).rows[0]

            await db.batch(
                [
                    {
                        sql: `UPDATE users
                        SET username = ?,
                            email = ?,
                            password = ?,
                            password_salt = ?,
                            experience_level = ?
                        WHERE
                            username = ?;`,
                        args: [
                            username ?? currentUser.username,
                            email ?? currentUser.email,
                            hash ?? currentUser.password,
                            salt ?? currentUser.passwordSalt,
                            experienceLevel ?? currentUser.experienceLevel,
                            currentUserName,
                        ],
                    },
                ],
                'write'
            )

            const updatedUser = (
                await db.execute({
                    sql: 'SELECT * FROM users WHERE username = ?',
                    args: [username ?? currentUserName],
                })
            ).rows[0]

            return {
                successfully: true,
                message: 'User updated',
                data: updatedUser,
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }

    static async delete(username: string) {
        try {
            await db.execute({
                sql: 'DELETE FROM users WHERE username = ?',
                args: [username],
            })

            return { successfully: true, message: 'User deleted' }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
