import { StatusCodes } from "http-status-codes";
import ErrorException from "./ErrorException";

export class ProductNotFoundException extends ErrorException {

    constructor(givenId: string) {
        super("Product Not Found", StatusCodes.NOT_FOUND, { productId: givenId })
    }
}