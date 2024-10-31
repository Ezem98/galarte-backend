import { Request, Response } from 'express'
import { ConversationModel } from '../models/conversations.ts'
import { validConversationData } from '../schemas/conversation.ts'

export class ConversationController {
    static async create(req: Request, res: Response) {
        const { body } = req

        const validationResult = validConversationData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ConversationModel.create(
            validationResult.data
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })

        return res.status(201).json({ successfully, message, data })
    }

    static async get(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message, data } = await ConversationModel.get(+id)

        return res.status(201).json({ successfully, message, data })
    }

    static async getAllByUserId(req: Request, res: Response) {
        const { userId } = req.params

        const { successfully, message, data } =
            await ConversationModel.getAllByUserId(+userId)

        return res.status(201).json({ successfully, message, data })
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message } = await ConversationModel.delete(+id)
        if (!successfully)
            return res.status(400).send({ successfully, message })
        return res.send({ successfully, message })
    }
}
