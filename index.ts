import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import { modelsRouter } from './routes/models.ts'
import { openAIRouter } from './routes/openAI.ts'
import { usersRouter } from './routes/users.ts'

const port = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles: true,
        tempFileDir: '/tmp/',
    })
)

app.get('/', (req, res) => {
    res.send('Página de inicio')
})

//region Rutas de usuarios
app.use('/users', usersRouter)

//region Rutas de OpenAI
app.use('/openai', openAIRouter)

//region Rutas de modelos
app.use('/models', modelsRouter)

//agregar un middleware para validar la sesión del usuario

//La última ruta a la que va a llegar es para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada')
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
