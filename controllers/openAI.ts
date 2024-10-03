import { Request, Response } from 'express'
import { OpenAIModel } from '../models/openAI.ts'
import { validOpenAIData } from '../schemas/openAI.ts'

export class OpenAIController {
    static async generateStepsWithOpenAI(req: Request, res: Response) {
        const { body } = req
        const validationResult = validOpenAIData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } =
            await OpenAIModel.generateStepsWithOpenAI(validationResult.data)

        if (!successfully) return res.status(400).send({ message })

        return res.json({ message, successfully, data })
    }
}
