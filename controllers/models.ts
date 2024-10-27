import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { ModelModel } from '../models/models.ts'
import { validModelData, validPartialModelData } from '../schemas/models.ts'

export class ModelController {
    static async getAll(req: Request, res: Response) {
        const { successfully, message, data } = await ModelModel.getAll()

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, data })
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message, data } = await ModelModel.getById(+id)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, data })
    }

    static async getByCategoryId(req: Request, res: Response) {
        const { categoryId } = req.params

        const { successfully, message, data } =
            await ModelModel.getByCategoryId(+categoryId)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, data })
    }

    static async getByName(req: Request, res: Response) {
        const { search } = req.params

        const { successfully, message, data } = await ModelModel.getByName(
            search
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })
        return res.json({ successfully, message, data })
    }

    static async getByUserId(req: Request, res: Response) {
        const { userId } = req.params

        const { successfully, message, data } = await ModelModel.getByUserId(
            userId
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })
        return res.json({ successfully, message, data })
    }

    static async getFavorites(req: Request, res: Response) {
        const { userId } = req.params

        const { successfully, message, data } = await ModelModel.getFavorites(
            userId
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })
        return res.json({ successfully, message, data })
    }

    static async create(req: Request, res: Response) {
        const { body, files } = req
        if (!files || Object.keys(files).length === 0)
            return res.status(400).send('No se encontró ningún archivo')

        const imageToUpload = files?.modelImage as UploadedFile // Campo de archivo

        const validationResult = validModelData({
            ...body,
            data: '',
            width: +body.width,
            height: +body.height,
            image: imageToUpload.tempFilePath,
            category_id: +body.categoryId,
            difficulty_rating: +body.difficultyRating,
        })

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ModelModel.create(
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, data })
    }

    static async update(req: Request, res: Response) {
        const { body } = req
        const { id } = req.params
        const validationResult = validPartialModelData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ModelModel.update(
            +id,
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, data })
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message } = await ModelModel.delete(+id)
        if (!successfully) return res.status(400).send({ message })
        return res.send({ message })
    }
}
