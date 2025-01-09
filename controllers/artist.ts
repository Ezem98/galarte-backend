import { Request, Response } from 'express'
import { ArtistModel } from '../models/artist.ts'
import { validArtistData, validPartialArtistData } from '../schemas/artist.ts'
import { UploadedFile } from 'express-fileupload'

export class ArtistController {
    static async getAll(req: Request, res: Response) {
        const { successfully, message, data } = await ArtistModel.getAll()

        if (!successfully) return res.status(400).send({ message })

        res.json({ successfully, message, data })
    }

    static async get(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message, data } = await ArtistModel.get(+id)

        if (!successfully) return res.status(400).send({ message })
        return res.json({ successfully, message, data })
    }

    static async create(req: Request, res: Response) {
        const { body, files } = req

        if (!files || Object.keys(files).length === 0)
            return res.status(400).send('No se encontró ningún archivo')

        const imageToUpload = files?.artistImage as UploadedFile // Campo de archivo

        const validationResult = validArtistData({
            ...body,
            image: imageToUpload.tempFilePath,
        })

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ArtistModel.create(
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ successfully, message, data })
    }

    static async update(req: Request, res: Response) {
        const { body } = req

        const { id } = req.params

        const validationResult = validPartialArtistData(body)

        if (validationResult.error)
            return res
                .status(400)
                .json({ error: JSON.parse(validationResult.error.message) })

        const { successfully, message, data } = await ArtistModel.update(
            +id,
            validationResult.data
        )

        if (!successfully) return res.status(400).send({ message })

        return res.status(201).json({ successfully, message, data })
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const { successfully, message } = await ArtistModel.delete(+id)
        if (!successfully) return res.status(400).send({ message })
        return res.send({ successfully, message })
    }
}
