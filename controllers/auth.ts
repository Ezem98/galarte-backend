import { Request, Response } from 'express'
import { ExperienceLevel } from '../enums/experienceLevel.ts'
import { AuthModel } from '../models/auth.ts'
import { CustomerModel } from '../models/customer.ts'
import { GoogleUser } from '../types/googleUser.ts'
import { IUser } from '../types/customer.ts'

export class AuthController {
    static async login(req: Request, res: Response) {
        const { username, password } = req.body

        const { successfully, message, data } = await AuthModel.login(
            username,
            password
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })

        res.json({ successfully, message, data })
    }

    static async google(req: Request, res: Response) {
        const user = req.user as GoogleUser

        const newUser: IUser = {
            name: user.name.givenName,
            surname: user.name.familyName,
            username: `${user.name.givenName.toLowerCase()}.${user.name.familyName.toLowerCase()}`,
            email: user?.emails?.[0].value ?? '',
            password: '',
            password_salt: '',
            experience_level: ExperienceLevel.BEGINNER,
            completed_profile: 0,
        }

        const { successfully, message, data } = await CustomerModel.create(
            newUser
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })

        res.json({ successfully, message, data })
    }
}
