import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import { authRouter } from './routes/auth.ts'
import { conversationMessageRouter } from './routes/conversationMessages.ts'
import { conversationRouter } from './routes/conversations.ts'
import { favoritesRouter } from './routes/favorites.ts'
import { modelsRouter } from './routes/models.ts'
import { openAIRouter } from './routes/openAI.ts'
import { userModelsRouter } from './routes/userModels.ts'
import { usersRouter } from './routes/users.ts'

const port = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        limits: { fileSize: 50 * 1024 * 1024 },
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

//region Rutas de modelos de usuario
app.use('/userModels', userModelsRouter)

//region Rutas de auth
app.use('/auth', authRouter)

//region Rutas de favoritos
app.use('/favorites', favoritesRouter)

//region Rutas de conversaciones
app.use('/favorites', conversationRouter)

//region Rutas de mesnajes de conversaciones
app.use('/favorites', conversationMessageRouter)

//agregar un middleware para validar la sesión del usuario

//La última ruta a la que va a llegar es para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada')
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
