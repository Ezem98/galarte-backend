export interface IArtwork {
    id?: number
    name: string
    description: string
    code: string
    serialNumber: string
    width: number
    height: number
    technique: string
    framed: number
    year: string
    image: string
    artistId: number
    createdAt?: string
    updatedAt?: string
}
