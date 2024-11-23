import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import { authRouter } from './routes/auth.ts'
import { artistsRouter } from './routes/artist.ts'
import { artworksRouter } from './routes/artwork.ts'
import { favoritesRouter } from './routes/favorite.ts'
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

//region Rutas de clientes
app.use('/customers', customersRouter)

//region Rutas de artistas
app.use('/artists', artistsRouter)

//region Rutas de obras
app.use('/artworks', artworksRouter)

//region Rutas de auth
app.use('/auth', authRouter)

//region Rutas de favoritos
app.use('/favorites', favoritesRouter)

//agregar un middleware para validar la sesión del usuario

//La última ruta a la que va a llegar es para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada')
})

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})
