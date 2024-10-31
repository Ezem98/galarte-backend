import { Request, Response } from 'express'
import { ConversationMessageModel } from '../models/conversationMessages.ts'
import { ConversationModel } from '../models/conversations.ts'
import {
    validConversationMessageData,
    validConversationMessageListData,
} from '../schemas/conversationMessage.ts'

export class ConversationMessageController {
    static async create(req: Request, res: Response) {
        const { body } = req
        const validationResult = validConversationMessageData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } =
            await ConversationMessageModel.create(validationResult.data)

        if (!successfully)
            return res.status(400).send({ successfully, message })

        return res.status(201).json({ successfully, message, data })
    }

    static async createAll(req: Request, res: Response) {
        const { body } = req

        const validationResult = validConversationMessageListData(body)

        let successfullyAll = true

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        for (const conversationMessage of validationResult.data.messages) {
            const { successfully, message } =
                await ConversationMessageModel.create(conversationMessage)

            if (!successfully) {
                successfullyAll = false
                break
            }
        }

        if (!successfullyAll)
            return res.status(400).send({
                successfully: successfullyAll,
                message: 'Error creating conversation messages',
            })

        return res.status(201).json({
            successfully: successfullyAll,
            message: 'Conversation messages created',
            data: [...validationResult.data.messages],
        })
    }

    static async get(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message, data } =
            await ConversationMessageModel.get(+id)

        return res.status(201).json({ successfully, message, data })
    }

    static async getAllByConversationId(req: Request, res: Response) {
        const { conversationId } = req.params

        const { successfully, message, data } =
            await ConversationMessageModel.getAllByConversationId(
                +conversationId
            )

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
