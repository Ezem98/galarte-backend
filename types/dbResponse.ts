export interface IDBResponse<T = any> {
    successfully: boolean
    message: string
    data?: T
}
