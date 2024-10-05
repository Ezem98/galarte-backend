import { Request, Response } from 'express'
import { UserModel } from '../models/users.ts'
import { validPartialUserData, validUserData } from '../schemas/users.ts'

export class UserController {
    static async getAll(req: Request, res: Response) {
        const { successfully, message, data: users } = await UserModel.getAll()

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, users })
    }

    static async getByUsername(req: Request, res: Response) {
        const { username } = req.params

        const {
            successfully,
            message,
            data: user,
        } = await UserModel.getByUsername(username)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, user })
    }

    static async create(req: Request, res: Response) {
        const { body } = req

        const validationResult = validUserData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await UserModel.create(
            validationResult.data
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })

        return res.status(201).json({ successfully, message, data })
    }

    static async update(req: Request, res: Response) {
        const { body } = req
        const { username: currentUserName } = req.params
        const validationResult = validPartialUserData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const {
            successfully,
            message,
            data: user,
        } = await UserModel.update(currentUserName, validationResult.data)

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, user })
    }

    static async delete(req: Request, res: Response) {
        const { username } = req.params

        const { successfully, message } = await UserModel.delete(username)
        if (!successfully) return res.status(400).send({ message })
        return res.send({ message })
    }
}
