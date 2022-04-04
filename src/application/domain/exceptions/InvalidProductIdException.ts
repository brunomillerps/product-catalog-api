import { StatusCodes } from "http-status-codes";
import ErrorException from "./ErrorException";

export class InvalidProductIdException extends ErrorException {

    constructor(givenId: string) {
        super("Product Id is unrecognized", StatusCodes.BAD_REQUEST, { productId: givenId, expect: 'uuid type' })
    }
}