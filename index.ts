import cors from 'cors'
import express from 'express'
import { openAIRouter } from './routes/openAI.ts'
import { usersRouter } from './routes/users.ts'

const port = process.env.PORT ?? 1234

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Página de inicio')
})

//region Rutas de usuarios
app.use('/users', usersRouter)

//region Rutas de OpenAI
app.use('/openai', openAIRouter)

//agregar un middleware para validar la sesión del usuario

//La última ruta a la que va a llegar es para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada')
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
