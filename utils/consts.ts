import { createClient } from '@libsql/client/web'

// #region Turso
const tursoConfig = {
    url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
}

export const db = createClient(tursoConfig)

// #region Cloudinary
export const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
}
