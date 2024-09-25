import { createClient } from '@libsql/Client'

const config = {
    url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
}

export const db = createClient(config)
