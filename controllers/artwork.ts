import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import { ArtworkModel } from '../models/artwork.ts'
import {
    validArtworkData,
    validPartialArtworkData,
} from '../schemas/artwork.ts'

export class ArtworkController {
    static async getAll(req: Request, res: Response) {
        const { limit } = req.query
        const { successfully, message, data } = await ArtworkModel.getAll(
            Number(limit)
        )

        if (!successfully) return res.status(400).send({ message })

        res.json({ message, data })
    }

    static async getRandom(req: Request, res: Response) {
        const { successfully, message, data } = await ArtworkModel.getRandom()

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, data })
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message, data } = await ArtworkModel.getById(+id)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, data })
    }

    static async getByArtistId(req: Request, res: Response) {
        const { artistId } = req.params
        const { limit } = req.query

        const { successfully, message, data } =
            await ArtworkModel.getByArtistId(+artistId, Number(limit))

        if (!successfully) return res.status(400).send({ message })
        return res.json({ message, data })
    }

    static async getByName(req: Request, res: Response) {
        const { search } = req.params

        const { successfully, message, data } = await ArtworkModel.getByName(
            search
        )

        if (!successfully)
            return res.status(400).send({ successfully, message })
        return res.json({ successfully, message, data })
    }

    static async create(req: Request, res: Response) {
        const { body, files } = req
        if (!files || Object.keys(files).length === 0)
            return res.status(400).send('No se encontró ningún archivo')

        const imageToUpload = files?.artworkImage as UploadedFile // Campo de archivo

        const validationResult = validArtworkData({
            ...body,
            width: +body.width,
            height: +body.height,
            length: +body.length,
            image: imageToUpload.tempFilePath,
            framed: +body.framed,
            category_id: +body.categoryId,
            difficulty_rating: +body.difficultyRating,
            artistId: +body.artistId,
            price: +body.price,
        })

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ArtworkModel.create(
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, data })
    }

    static async update(req: Request, res: Response) {
        const { body } = req
        const { id } = req.params
        const validationResult = validPartialArtworkData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ArtworkModel.update(
            +id,
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ message, data })
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message } = await ArtworkModel.delete(+id)
        if (!successfully) return res.status(400).send({ message })
        return res.send({ message })
    }
}
