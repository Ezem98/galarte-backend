import { Request, Response } from 'express'
import { CustomerModel } from '../models/customer.ts'
import {
    validPartialUserData,
    validUpdatePasswordData,
    validUserData,
} from '../schemas/users.ts'
import { debug } from 'console'

export class CustomerController {
    static async getAll(req: Request, res: Response) {
        const {
            successfully,
            message,
            data: users,
        } = await CustomerModel.getAll()

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, users })
    }

    static async getByUsername(req: Request, res: Response) {
        const { username } = req.params

        const {
            successfully,
            message,
            data: user,
        } = await CustomerModel.getByUsername(username)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, user })
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message, data } = await CustomerModel.getById(+id)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ successfully, message, data })
    }

    static async create(req: Request, res: Response) {
        const { body } = req
        const validationResult = validUserData(body)
        if (validationResult.error)
            return res.status(400).json({
                successfully: false,
                message: 'Revisar los datos ingresados',
            })

        const { successfully, message, data } = await CustomerModel.create(
            validationResult.data
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })

        return res.status(201).json({ successfully, message, data })
    }

    static async update(req: Request, res: Response) {
        const { body } = req

        const { username: currentUserName } = req.params

        if (body.newPassword) {
            const passwordValidationResult = validUpdatePasswordData(body)

            if (passwordValidationResult.error)
                return res.status(400).json({
                    error: JSON.parse(passwordValidationResult.error.message),
                })
        }

        const validationResult = validPartialUserData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const {
            successfully,
            message,
            data: user,
        } = await CustomerModel.update(currentUserName, validationResult.data)

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ successfully, message, user })
    }

    static async delete(req: Request, res: Response) {
        const { username } = req.params

        const { successfully, message } = await CustomerModel.delete(username)
        if (!successfully) return res.status(400).send({ message })
        return res.send({ message })
    }
}
