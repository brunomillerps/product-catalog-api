import ErrorException from "@domain/exceptions/ErrorException"
import { ProductNotFoundException } from "@domain/exceptions/ProductNotFound"
import { BrokenCircuitError } from "cockatiel"
import { StatusCodes } from "http-status-codes"
import SupplyChainClientRest from "./SupplyChainClientRest"

export abstract class SupplyChainBaseGateway {
    readonly client: SupplyChainClientRest

    constructor(client?: SupplyChainClientRest) {
        this.client = client || new SupplyChainClientRest()
    }

    handleException(ex: Error, data?: any) {
        if (ex instanceof BrokenCircuitError) {
            throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.SERVICE_UNAVAILABLE)
        }

        // axios doesn't throw a typed Error
        if (ex['response']) {
            switch (ex['response']['status']) {
                case 400:
                    throw new ErrorException(ex['message'], StatusCodes.BAD_REQUEST)
                case 404:
                    throw new ProductNotFoundException(data)
                default:
                    throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.SERVICE_UNAVAILABLE)
            }
        }
        throw ex
    }
}