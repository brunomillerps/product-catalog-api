import { StatusCodes } from "http-status-codes"
import ErrorException from "./ErrorException"
import { InvalidProductIdException } from "./InvalidProductIdException"

describe('InvalidProductIdException', () => {
    it('should create invalid product id exception with valid attributes', () => {
        const exception: ErrorException = new InvalidProductIdException("id")

        expect(exception.message).toBe('Product Id is unrecognized')
        expect(exception.name).toBe('InvalidProductIdException')
        expect(exception.status).toBe(StatusCodes.BAD_REQUEST)
    })
})