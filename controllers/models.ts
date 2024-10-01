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
        const { body, files } = req
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send('No se encontró archivo .obj')

        console.log({ body, files })
        const fileToUpload = req.files.modelData // Campo de archivo

        // Verificar si el archivo es un único UploadedFile
        if (Array.isArray(fileToUpload))
            return res
                .status(400)
                .send('Multiple files were uploaded. Only one expected.')

        // Validar la extensión del archivo
        const validExtension = '.obj'
        const fileExtension = fileToUpload.name.split('.').pop()

        if (fileExtension !== validExtension)
            return res
                .status(400)
                .send(
                    `Extensión de archivo inválida. Solo se permiten archivos con extensión ${validExtension}.`
                )

        // Convertir el archivo a Base64
        const fileBuffer = fileToUpload.data // Obtiene el buffer del archivo
        const base64File = fileBuffer.toString('base64') // Convierte a Base64

        const validationResult = validModelData({ ...body, data: base64File })

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
