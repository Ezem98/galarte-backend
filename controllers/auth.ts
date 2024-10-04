import { Request, Response } from 'express'
import { AuthModel } from '../models/auth.ts'

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
}
