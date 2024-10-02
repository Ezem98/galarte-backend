import { Request, Response } from 'express'
import { UserModelModel } from '../models/userModel.ts'
import {
    validPartialUserModelData,
    validUserModelData,
} from '../schemas/userModel.ts'

export class UserModelController {
    static async getAllByUserId(req: Request, res: Response) {
        const { userId } = req.params

        const {
            successfully,
            message,
            data: models,
        } = await UserModelModel.getAllByUserId(+userId)

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, models })
    }

    static async getAllByModelId(req: Request, res: Response) {
        const { modelId } = req.params

        const {
            successfully,
            message,
            data: models,
        } = await UserModelModel.getAllByModelId(+modelId)

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, models })
    }

    static async get(req: Request, res: Response) {
        const { userId, modelId } = req.params

        const {
            successfully,
            message,
            data: model,
        } = await UserModelModel.get(+userId, +modelId)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, model })
    }

    static async create(req: Request, res: Response) {
        const { body } = req

        const validationResult = validUserModelData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const {
            successfully,
            message,
            data: model,
        } = await UserModelModel.create(validationResult.data)

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, model })
    }

    static async update(req: Request, res: Response) {
        const { body } = req

        const { userId, modelId } = req.params

        const validationResult = validPartialUserModelData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const {
            successfully,
            message,
            data: model,
        } = await UserModelModel.update(
            +userId,
            +modelId,
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, model })
    }

    static async delete(req: Request, res: Response) {
        const { userId, modelId } = req.params

        const { successfully, message } = await UserModelModel.delete(
            +userId,
            +modelId
        )
        if (!successfully) return res.status(400).send({ message })
        return res.send({ message })
    }
}
