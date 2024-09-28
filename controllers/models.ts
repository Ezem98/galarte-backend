import { Request, Response } from 'express'
import { ModelModel } from '../models/models.ts'
import { validModelData, validPartialModelData } from '../schemas/models.ts'

export class ModelController {
    static async getAll(req: Request, res: Response) {
        const {
            successfully,
            message,
            data: models,
        } = await ModelModel.getAll()

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, models })
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params

        const {
            successfully,
            message,
            data: model,
        } = await ModelModel.getById(+id)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, model })
    }

    static async create(req: Request, res: Response) {
        const { body } = req
        const validationResult = validModelData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const {
            successfully,
            message,
            data: model,
        } = await ModelModel.create(validationResult.data)

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, model })
    }

    static async update(req: Request, res: Response) {
        const { body } = req
        const { id } = req.params
        const validationResult = validPartialModelData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const {
            successfully,
            message,
            data: model,
        } = await ModelModel.update(+id, validationResult.data)

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, model })
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message } = await ModelModel.delete(+id)
        if (!successfully) return res.status(400).send({ message })
        return res.send({ message })
    }
}
