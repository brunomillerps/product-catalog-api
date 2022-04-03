import { StatusCodes } from 'http-status-codes';

export default class ErrorException extends Error {

    public readonly status: StatusCodes
    public readonly reason: string
    public readonly metaData: any
    
    constructor(message: string, status: StatusCodes, metaData: any = null) {
        super(message)
        this.reason = message
        this.name = this.constructor.name
        this.status = status
        this.metaData = metaData
    }
}