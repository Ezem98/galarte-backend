import { UserModel } from '../models/users.ts'
import { validPassword } from '../utils/functions.ts'

export class AuthModel {
    static async login(username: string, password: string) {
        try {
            const { data: user } = await UserModel.getByUsername(username)

            if (!user)
                return {
                    successfully: false,
                    message: 'User not found',
                }

            const valid = validPassword(
                password,
                user.password as string,
                user.password_salt as string
            )

            if (valid)
                return {
                    successfully: true,
                    message: 'User logged in',
                    data: user,
                }

            return {
                successfully: false,
                message: 'Failed to logged in. Wrong username or password',
            }
        } catch (error: any) {
            return { successfully: false, message: error.message }
        }
    }
}
